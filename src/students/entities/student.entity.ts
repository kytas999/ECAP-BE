import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

import { DatedGenericEntity } from '@/core/generic-entity';
import { AcademyEntity } from '@/school/entities/academy.entity';
import { SchoolEntity } from '@/school/entities/school.entity';
import { AssignmentPeriodEntity } from '@/school/entities/subject-assignment.entity';
import { TrackEntity } from '@/track/entities/track.entity';
import { UserEntity } from '@/users/entities/user.entity';

@Entity({ name: 'students' })
export class StudentEntity extends DatedGenericEntity {
  @ApiProperty({ description: 'School ID associated with this student' })
  @Column()
  school_id: number;

  @ApiProperty({ description: 'User ID associated with this student' })
  @PrimaryColumn()
  id: number;

  @ApiProperty({
    description: 'Academy ID associated with this student',
    nullable: true,
  })
  @Column({ nullable: true })
  academy_id: number;

  @ApiProperty({
    description: 'Track ID associated with this student',
    nullable: true,
  })
  @Column({ nullable: true })
  track_id: number;

  @ApiProperty({ description: 'Student grade', maxLength: 250 })
  @Column({ length: 250 })
  grade: string;

  @ApiProperty({
    description: 'School associated with this student',
    type: () => Object,
  })
  @ManyToOne(() => SchoolEntity, (school) => school.students)
  @JoinColumn({ name: 'school_id' })
  school: SchoolEntity;

  @ApiProperty({
    description: 'User associated with this student',
    type: () => UserEntity,
  })
  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'id' })
  user: UserEntity;

  @ApiProperty({
    description: 'Academy associated with this student',
    type: () => Object,
  })
  @ManyToOne(() => AcademyEntity)
  @JoinColumn({ name: 'academy_id' })
  academy: AcademyEntity;

  @ApiProperty({
    description: 'Track associated with this student',
    type: () => Object,
  })
  @ManyToOne(() => TrackEntity, (track) => track.students)
  @JoinColumn({ name: 'track_id' })
  track: TrackEntity;

  @ApiProperty({
    description: 'Assignment periods for this student',
    type: () => [{}],
  })
  @OneToMany(
    () => AssignmentPeriodEntity,
    (assignment_period) => assignment_period.student,
  )
  assignment_periods: AssignmentPeriodEntity[];
}
