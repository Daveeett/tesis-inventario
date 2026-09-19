import { Component, OnInit, ElementRef, ViewChild, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';
import { ProductService } from '../../../../core/services/product.service';
import { CategoryService } from '../../../../core/services/category.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Category, Subcategory } from '../../../../core/models/api.models';

@Component({
  selector: 'app-product-form-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink, NgIconComponent],
  templateUrl: './product-form.page.html',
})
export class ProductFormPage implements OnInit, OnDestroy {
  @ViewChild('scannerVideo') scannerVideoRef?: ElementRef<HTMLVideoElement>;

  form!: FormGroup;
  isEdit = false;
  productId: string | null = null;

  readonly loading         = signal(false);
  readonly saving          = signal(false);
  readonly error           = signal('');
  readonly successMessage  = signal('');
  readonly categories      = signal<Category[]>([]);
  readonly subcategories   = signal<Subcategory[]>([]);

  // Barcode scanner / lookup state
  barcodeSearchInput = '';
  readonly barcodeSearching = signal(false);

  // Camera Scanner Modal State
  readonly cameraActive = signal(false);
  readonly cameraError = signal('');
  private mediaStream: MediaStream | null = null;
  private animFrameId: number | null = null;

  // Image state
  imagePreview: string | null = null;
  imageBase64: string | null = null;
  readonly imageLoading = signal(false);

  // Specifications helpers
  specKeys:   string[] = [];
  specValues: string[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly productSvc: ProductService,
    private readonly categorySvc: CategoryService,
    public readonly authSvc: AuthService,
  ) {}

  ngOnInit() {
    this.buildForm();
    this.categorySvc.getCategories().subscribe((res) => this.categories.set(res.data));

    this.productId = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.productId;

    if (this.isEdit && this.productId) {
      this.loading.set(true);
      this.productSvc.getById(this.productId).subscribe({
        next: (res) => {
          const p = res.data;
          this.form.patchValue({
            name:          p.name,
            brand:         p.brand,
            model:         p.model,
            serialNumber:  p.serialNumber,
            description:   p.description,
            purchasePrice: p.purchasePrice ?? 0,
            salePrice:     p.salePrice,
            stock:         p.stock,
            minStock:      p.minStock,
            subcategoryId: p.subcategoryId,
            isActive:      p.isActive,
          });

          if (p.serialNumber) {
            this.barcodeSearchInput = p.serialNumber;
          }

          if (p.imageBase64) {
            this.imagePreview = p.imageBase64;
            this.imageBase64  = p.imageBase64;
          }

          if (p.specifications) {
            this.specKeys   = Object.keys(p.specifications);
            this.specValues = Object.values(p.specifications);
          }

          if (p.subcategory?.categoryId) {
            this.form.patchValue({ categoryId: p.subcategory.categoryId });
            this.onCategoryChange(p.subcategory.categoryId);
          }

          this.loading.set(false);
        },
        error: () => { this.loading.set(false); void this.router.navigateByUrl('/catalog'); },
      });
    }
  }

  ngOnDestroy() {
    this.stopCameraScanner();
  }

  private buildForm() {
    this.form = this.fb.group({
      name:          ['', [Validators.required, Validators.maxLength(200)]],
      brand:         ['', [Validators.required, Validators.maxLength(100)]],
      model:         [''],
      serialNumber:  [''],
      description:   [''],
      purchasePrice: [0, [Validators.required, Validators.min(0)]],
      salePrice:     [0, [Validators.required, Validators.min(0)]],
      stock:         [0, [Validators.required, Validators.min(0)]],
      minStock:      [1, [Validators.required, Validators.min(0)]],
      categoryId:    [''],
      subcategoryId: [''],
      isActive:      [true],
    });
  }

  /** Búsqueda y auto-completado por código de barras */
  lookupBarcode() {
    const code = this.barcodeSearchInput.trim();
    if (!code || this.barcodeSearching()) return;

    this.barcodeSearching.set(true);
    this.error.set('');
    this.successMessage.set('');

    this.productSvc.lookupBarcode(code).subscribe({
      next: (res) => {
        this.barcodeSearching.set(false);
        const data = res.data;
        if (!data) return;

        this.form.patchValue({
          serialNumber: data.serialNumber || code,
        });

        if (data.foundInInternet) {
          if (data.name) this.form.patchValue({ name: data.name });
          if (data.brand) this.form.patchValue({ brand: data.brand });
          if (data.description) this.form.patchValue({ description: data.description });
          if (data.imageUrl && !this.imagePreview) {
            this.imagePreview = data.imageUrl;
            this.imageBase64 = data.imageUrl;
          }
          if (data.specifications) {
            this.specKeys = Object.keys(data.specifications);
            this.specValues = Object.values(data.specifications);
          }
          this.successMessage.set('✅ Datos encontrados en internet y auto-completados. Puedes modificarlos libremente.');
        } else {
          this.successMessage.set('ℹ️ Código asignado al producto. No se encontraron datos en internet, por favor completa los campos manualmente.');
        }
      },
      error: (err: Error) => {
        this.barcodeSearching.set(false);
        this.error.set(`Error al consultar código de barras: ${err.message}`);
      },
    });
  }

  /** Iniciar escáner de cámara en tiempo real */
  async startCameraScanner() {
    this.cameraError.set('');
    this.cameraActive.set(true);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Tu navegador o dispositivo no soporta el acceso a la cámara.');
      }

      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });

      setTimeout(() => {
        if (this.scannerVideoRef?.nativeElement) {
          const videoEl = this.scannerVideoRef.nativeElement;
          videoEl.srcObject = this.mediaStream;
          void videoEl.play();
          this.scanVideoFrame();
        }
      }, 100);
    } catch (err: any) {
      this.cameraActive.set(false);
      this.cameraError.set(err.message || 'No se pudo acceder a la cámara del dispositivo.');
    }
  }

  /** Detener cámara */
  stopCameraScanner() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
    this.cameraActive.set(false);
  }

  /** Loop de detección de código de barras usando BarcodeDetector Native API */
  private async scanVideoFrame() {
    if (!this.cameraActive() || !this.scannerVideoRef?.nativeElement) return;

    const videoEl = this.scannerVideoRef.nativeElement;
    if (videoEl.readyState === videoEl.HAVE_ENOUGH_DATA) {
      if ('BarcodeDetector' in window) {
        try {
          const detector = new (window as any).BarcodeDetector({
            formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39', 'qr_code', 'itf'],
          });
          const barcodes = await detector.detect(videoEl);
          if (barcodes && barcodes.length > 0) {
            const detectedCode = barcodes[0].rawValue;
            if (detectedCode) {
              this.barcodeSearchInput = detectedCode;
              this.stopCameraScanner();
              this.lookupBarcode();
              return;
            }
          }
        } catch (e) {
          // Detector scanning
        }
      }
    }

    this.animFrameId = requestAnimationFrame(() => this.scanVideoFrame());
  }

  /** Detección alternativa mediante foto/captura directa */
  onScanPhoto(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      const img = new Image();
      img.onload = async () => {
        if ('BarcodeDetector' in window) {
          try {
            const detector = new (window as any).BarcodeDetector({
              formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39', 'qr_code', 'itf'],
            });
            const barcodes = await detector.detect(img);
            if (barcodes && barcodes.length > 0) {
              const detectedCode = barcodes[0].rawValue;
              if (detectedCode) {
                this.barcodeSearchInput = detectedCode;
                this.lookupBarcode();
                return;
              }
            }
          } catch (err) {
            console.warn(err);
          }
        }
        this.successMessage.set('📸 Imagen capturada. Si la detección automática no encuentra el código en la foto, por favor verifica el número.');
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  }

  onCategoryChange(categoryId: string) {
    this.subcategories.set([]);
    this.form.patchValue({ subcategoryId: '' });
    if (!categoryId) return;
    this.categorySvc.getSubcategoriesByCategory(categoryId).subscribe((res) =>
      this.subcategories.set(res.data),
    );
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.imageLoading.set(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const originalDataUrl = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const maxSize = 800;
        let { width, height } = img;
        if (width > height && width > maxSize) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        } else if (height >= width && height > maxSize) {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, width, height);

        const compressed = canvas.toDataURL('image/jpeg', 0.75);
        this.imageBase64  = compressed;
        this.imagePreview = compressed;
        this.imageLoading.set(false);
      };
      img.src = originalDataUrl;
    };
    reader.readAsDataURL(file);
  }

  removeImage() {
    this.imageBase64  = null;
    this.imagePreview = null;
  }

  addSpec() { this.specKeys.push(''); this.specValues.push(''); }

  removeSpec(i: number) {
    this.specKeys.splice(i, 1);
    this.specValues.splice(i, 1);
  }

  buildSpecifications(): Record<string, string> | null {
    if (this.specKeys.length === 0) return null;
    const obj: Record<string, string> = {};
    this.specKeys.forEach((k, i) => { if (k.trim()) obj[k.trim()] = this.specValues[i] ?? ''; });
    return Object.keys(obj).length ? obj : null;
  }

  save() {
    if (this.form.invalid || this.saving()) return;
    this.saving.set(true);
    this.error.set('');

    const val = this.form.value;
    const payload = {
      name:           val.name,
      brand:          val.brand,
      model:          val.model          || null,
      serialNumber:   val.serialNumber   || null,
      description:    val.description    || null,
      specifications: this.buildSpecifications(),
      purchasePrice:  this.authSvc.isVendedor() ? 0 : +val.purchasePrice,
      salePrice:      +val.salePrice,
      stock:          +val.stock,
      minStock:       +val.minStock,
      subcategoryId:  val.subcategoryId  || null,
      isActive:       val.isActive,
      imageBase64:    this.imageBase64,
    };

    const req$ = this.isEdit && this.productId
      ? this.productSvc.update(this.productId, payload)
      : this.productSvc.create(payload);

    req$.subscribe({
      next: () => { this.saving.set(false); void this.router.navigateByUrl('/catalog'); },
      error: (err: Error) => { this.error.set(err.message); this.saving.set(false); },
    });
  }

  cancel() { void this.router.navigateByUrl('/catalog'); }
}
