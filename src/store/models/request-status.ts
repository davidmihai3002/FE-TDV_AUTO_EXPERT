import { types } from 'mobx-state-tree';

export const RequestStatus = types.enumeration('RequestStatus', ['idle', 'pending', 'done', 'error']);
