// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
// import { User } from '../../users/entities/user.entity';

// @Entity('user_hours')
// export class UserHours {
//     @PrimaryGeneratedColumn()
//     id: number;

//     @ManyToOne(() => User, user => user.hours, { onDelete: 'CASCADE' })
//     user: User;

//     @Column({ default: 'Beca' })
//     hourType: string

//     @Column({ type: 'decimal', default: 16 })
//     owedHours: number;
//     }
