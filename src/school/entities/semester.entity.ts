import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { GenericEntity } from '@/core/generic-entity';

import { SchoolEntity } from './school.entity';

@Entity({ name: 'semesters' })
export class SemesterEntity extends GenericEntity {
  @Column()
  school_id: number;

  @Column({ length: 50 })
  name: string;

  @Column()
  start_date: Date;

  @Column()
  end_date: Date;

  @ManyToOne(() => SchoolEntity, (school) => school.semesters)
  @JoinColumn({ name: 'school_id' })
  school: SchoolEntity;
}
