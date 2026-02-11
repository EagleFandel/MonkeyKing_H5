import type { IconDefinition, IconName } from '@/components/icons/types'

import { circlePath, roundedRectPath } from '@/components/icons/primitives'

export const iconRegistry: Record<IconName, IconDefinition> = {
  'brand-monkey': {
    strokes: [
      circlePath(12, 12, 8.4),
      'M 8.5 11.2 C 9.4 10.1 10.6 9.6 12 9.6 C 13.4 9.6 14.6 10.1 15.5 11.2',
      'M 9.8 14.2 C 10.4 14.8 11.1 15.1 12 15.1 C 12.9 15.1 13.6 14.8 14.2 14.2',
      circlePath(9.2, 8.4, 0.8),
      circlePath(14.8, 8.4, 0.8),
    ],
    fills: [{ d: circlePath(6.2, 9, 2.2), tone: 'soft' }, { d: circlePath(17.8, 9, 2.2), tone: 'soft' }],
    defaultTone: 'mixed',
  },
  bell: {
    strokes: [
      'M 7 16 H 17',
      'M 8.2 16 C 7.8 15.4 7.6 14.7 7.6 14 V 11 C 7.6 8.6 9.3 6.6 11.6 6.2 V 5.4 C 11.6 5 11.9 4.7 12.3 4.7 C 12.7 4.7 13 5 13 5.4 V 6.2 C 15.3 6.6 17 8.6 17 11 V 14 C 17 14.7 16.8 15.4 16.4 16',
      'M 10.4 17.3 C 10.7 18.2 11.4 18.7 12.3 18.7 C 13.2 18.7 13.9 18.2 14.2 17.3',
    ],
    defaultTone: 'blue',
  },
  home: {
    strokes: [
      'M 4.5 10.6 L 12 4.8 L 19.5 10.6',
      'M 6.5 9.8 V 18 H 17.5 V 9.8',
      'M 10.1 18 V 13 H 13.9 V 18',
    ],
    fills: [{ d: roundedRectPath(8.9, 12.4, 6.2, 5.6, 1.2), tone: 'soft' }],
    defaultTone: 'blue',
  },
  discover: {
    strokes: [
      circlePath(12, 12, 7.8),
      'M 12 4.8 V 7.1',
      'M 12 16.9 V 19.2',
      'M 4.8 12 H 7.1',
      'M 16.9 12 H 19.2',
      'M 9.2 14.8 L 15.6 8.4',
      circlePath(15.8, 8.2, 1.1),
    ],
    fills: [{ d: circlePath(15.8, 8.2, 1.1), tone: 'accent' }],
    defaultTone: 'mixed',
  },
  project: {
    strokes: [
      roundedRectPath(4.6, 5.3, 14.8, 10.8, 2.2),
      'M 8.2 18.6 H 15.8',
      'M 10.1 8.8 L 8.5 10.6 L 10.1 12.4',
      'M 13.9 8.8 L 15.5 10.6 L 13.9 12.4',
      'M 11.6 13.1 L 12.4 8.1',
    ],
    fills: [{ d: roundedRectPath(6.2, 6.7, 11.6, 8, 1.6), tone: 'soft' }],
    defaultTone: 'blue',
  },
  tutor: {
    strokes: [
      roundedRectPath(5.2, 5.2, 13.6, 13.6, 1.8),
      'M 8.2 9 H 15.8',
      'M 8.2 12 H 14.1',
      'M 8.2 15 H 12.5',
      'M 16.8 7.8 L 19.1 5.5',
    ],
    fills: [{ d: roundedRectPath(6.4, 6.4, 11.2, 11.2, 1.2), tone: 'soft' }],
    defaultTone: 'blue',
  },
  profile: {
    strokes: [circlePath(12, 9, 3.1), 'M 6.2 18.4 C 7.3 15.9 9.3 14.6 12 14.6 C 14.7 14.6 16.7 15.9 17.8 18.4', circlePath(12, 12, 8.2)],
    fills: [{ d: circlePath(12, 8.9, 2.6), tone: 'soft' }],
    defaultTone: 'blue',
  },
  sparring: {
    strokes: [
      circlePath(12, 12, 8.1),
      'M 8.1 8.8 C 9.5 10.2 10.5 11.5 11.6 13.3',
      'M 15.9 8.8 C 14.5 10.2 13.5 11.5 12.4 13.3',
      'M 7.7 14.9 C 9.3 14.4 10.7 14.1 12 14.1 C 13.3 14.1 14.7 14.4 16.3 14.9',
    ],
    fills: [{ d: circlePath(12, 12, 2.1), tone: 'soft' }],
    defaultTone: 'mixed',
  },
  assistant: {
    strokes: [
      roundedRectPath(5.4, 7.1, 13.2, 10.2, 3),
      'M 9 11 H 9.1',
      'M 15 11 H 15.1',
      'M 9.4 14 C 10.2 14.8 11 15.2 12 15.2 C 13 15.2 13.8 14.8 14.6 14',
      'M 12 7 V 4.8',
      'M 9 19.5 H 15',
    ],
    fills: [{ d: roundedRectPath(6.6, 8.3, 10.8, 7.8, 2), tone: 'soft' }],
    defaultTone: 'mixed',
  },
  shield: {
    strokes: ['M 12 4.8 L 18.3 7.1 V 11.2 C 18.3 14.8 15.9 17.9 12 19.1 C 8.1 17.9 5.7 14.8 5.7 11.2 V 7.1 Z', 'M 9 11.7 L 11.1 13.8 L 15.2 9.8'],
    fills: [{ d: 'M 12 6.3 L 16.8 8.1 V 11 C 16.8 13.8 14.9 16.1 12 17 C 9.1 16.1 7.2 13.8 7.2 11 V 8.1 Z', tone: 'soft' }],
    defaultTone: 'blue',
  },
  bonus: {
    strokes: [
      roundedRectPath(4.8, 7.2, 14.4, 11.2, 2.1),
      'M 9 10.4 H 15',
      'M 12 8.7 V 16.7',
      'M 8.2 14.2 C 8.9 15.1 10.1 15.7 11.3 15.7',
      'M 15.8 10.2 C 15.1 9.3 13.9 8.7 12.7 8.7',
    ],
    fills: [{ d: roundedRectPath(6.2, 8.5, 11.6, 8.6, 1.6), tone: 'soft' }],
    defaultTone: 'orange',
  },
  match: {
    strokes: [circlePath(10.1, 10.1, 5.5), 'M 13.8 13.8 L 18.7 18.7', 'M 7.5 10.1 L 9.1 11.7 L 12.7 8.1'],
    fills: [{ d: circlePath(10.1, 10.1, 4), tone: 'soft' }],
    defaultTone: 'mixed',
  },
  'status-default': {
    strokes: ['M 12 4.8 L 13.4 8.8 L 17.6 9 L 14.3 11.5 L 15.4 15.4 L 12 13.1 L 8.6 15.4 L 9.7 11.5 L 6.4 9 L 10.6 8.8 Z'],
    fills: [{ d: 'M 12 6.6 L 13 9.2 L 15.8 9.4 L 13.7 11 L 14.4 13.8 L 12 12.4 L 9.6 13.8 L 10.3 11 L 8.2 9.4 L 11 9.2 Z', tone: 'soft' }],
    defaultTone: 'mixed',
  },
  'status-loading': {
    strokes: [circlePath(12, 12, 7.9), 'M 12 4.1 V 6.4', 'M 17.6 6.4 L 16 8', 'M 19.9 12 H 17.6', 'M 17.6 17.6 L 16 16', 'M 12 19.9 V 17.6', 'M 6.4 17.6 L 8 16', 'M 4.1 12 H 6.4', 'M 6.4 6.4 L 8 8'],
    defaultTone: 'warning',
  },
  'status-empty': {
    strokes: [roundedRectPath(5, 6.2, 14, 10.8, 2), 'M 5.8 9.4 L 12 13.1 L 18.2 9.4', 'M 9.2 16.4 H 14.8'],
    fills: [{ d: roundedRectPath(6.2, 7.4, 11.6, 8.4, 1.5), tone: 'soft' }],
    defaultTone: 'neutral',
  },
  'status-error': {
    strokes: ['M 12 5.2 L 18.8 17.8 H 5.2 Z', 'M 12 9.5 V 13.4', 'M 12 15.6 H 12.1'],
    fills: [{ d: 'M 12 6.9 L 17.3 16.8 H 6.7 Z', tone: 'soft' }],
    defaultTone: 'error',
  },
  'status-success': {
    strokes: [circlePath(12, 12, 8.2), 'M 8.2 12.2 L 10.8 14.8 L 15.8 9.8'],
    fills: [{ d: circlePath(12, 12, 6.6), tone: 'soft' }],
    defaultTone: 'success',
  },
}

