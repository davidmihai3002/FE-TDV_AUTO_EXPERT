import { types, type Instance, type SnapshotOut } from 'mobx-state-tree';
import { CATEGORIES, CATEGORY_LABEL, FUELS, TRANSMISSIONS, TRANSMISSION_LABEL } from '@/libs';
import type { BodyType } from '@/types';

export const InstructorModel = types.model('Instructor', {
  id: types.string,
  fullName: types.string,
  phoneNumber: types.string,
  photoUrl: types.maybeNull(types.string),
  photoAlt: types.maybeNull(types.string),
});

const BODY_TYPES: BodyType[] = ['compact', 'hatchback', 'sedan', 'coupe', 'suv'];

export const FleetCarModel = types
  .model('FleetCar', {
    id: types.identifier,
    slug: types.string,
    carName: types.string,
    series: types.maybeNull(types.string),
    category: types.enumeration(CATEGORIES),
    badgeLabel: types.maybeNull(types.string),
    transmission: types.enumeration(TRANSMISSIONS),
    transmissionLabel: types.maybeNull(types.string),
    fuel: types.enumeration(FUELS),
    bodyType: types.maybeNull(types.enumeration(BODY_TYPES)),
    horsepower: types.maybeNull(types.number),
    zeroToHundredSeconds: types.maybeNull(types.number),
    imageUrl: types.string,
    imageAlt: types.string,
    successRate: types.maybeNull(types.number),
    averageGrade: types.maybeNull(types.number),
    displayOrder: types.number,
    instructor: types.maybeNull(InstructorModel),
  })
  .views((self) => ({
    get badgeText(): string {
      return self.badgeLabel ?? CATEGORY_LABEL[self.category];
    },
    get transmissionText(): string {
      return self.transmissionLabel ?? TRANSMISSION_LABEL[self.transmission];
    },
  }));

export type FleetCarInstance = Instance<typeof FleetCarModel>;
export type FleetCarSnapshot = SnapshotOut<typeof FleetCarModel>;
