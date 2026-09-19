import { Column, Entity, Index } from "typeorm";
import { BaseEntity } from "./base.entity";
import { UserRole } from "./enums/user-role.enum";

@Entity("users")
export class User extends BaseEntity {
  @Column({ length: 150 })
  name!: string;

  @Index({ unique: true })
  @Column({ length: 180 })
  email!: string;

  @Column({ name: "password_hash", length: 255 })
  passwordHash!: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.CAJERO,
  })
  role!: UserRole;

  @Column({ name: "is_active", default: true })
  isActive!: boolean;

  /** UUID rotado en cada login — si cambia, la sesion anterior queda invalida */
  @Column({ name: "session_token", type: "uuid", nullable: true, default: null })
  sessionToken!: string | null;

  @Column({ name: "failed_attempts", type: "int", default: 0 })
  failedAttempts!: number;

  @Column({ name: "locked_until", type: "timestamp", nullable: true, default: null })
  lockedUntil!: Date | null;
}
