import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'Task' })
export class TaskEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ default: false })
  isCompleted: boolean;
}
  