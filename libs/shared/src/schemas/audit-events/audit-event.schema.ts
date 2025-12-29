import { z } from 'zod';

/**
 * Actor schema for audit events
 */
export const actorSchema = z.object({
  type: z.enum(['user', 'api_key', 'system'], {
    errorMap: () => ({ message: 'Actor type must be user, api_key, or system' }),
  }),
  id: z.string().uuid('Actor ID must be a valid UUID').optional(),
  name: z.string().max(200, 'Actor name is too long').optional(),
});

/**
 * Target schema for audit events
 */
export const targetSchema = z.object({
  type: z.string().min(1, 'Target type is required').max(100, 'Target type is too long'),
  id: z.string().uuid('Target ID must be a valid UUID').optional(),
  name: z.string().max(200, 'Target name is too long').optional(),
});

/**
 * Create audit event request schema
 * Used for ingesting new audit events via API
 */
export const createAuditEventSchema = z.object({
  action: z
    .string()
    .min(1, 'Action is required')
    .max(100, 'Action is too long')
    .regex(
      /^[a-z_]+(\.[a-z_]+)+$/,
      'Action must be in format: resource.action (e.g., user.created, payment.processed)'
    ),
  actor: actorSchema.optional(),
  target: targetSchema.optional(),
  metadata: z.record(z.unknown()).optional(),
  ipAddress: z.string().ip('Invalid IP address').optional(),
  userAgent: z.string().max(500, 'User agent is too long').optional(),
  timestamp: z.string().datetime('Invalid timestamp format').optional(),
});

/**
 * Query audit events request schema
 * Used for filtering and paginating audit events
 */
export const queryAuditEventsSchema = z.object({
  action: z.string().max(100).optional(),
  actorType: z.enum(['user', 'api_key', 'system']).optional(),
  actorId: z.string().uuid('Actor ID must be a valid UUID').optional(),
  targetType: z.string().max(100).optional(),
  targetId: z.string().uuid('Target ID must be a valid UUID').optional(),
  from: z.string().datetime('Invalid from date format').optional(),
  to: z.string().datetime('Invalid to date format').optional(),
  limit: z.coerce.number().int().min(1).max(500).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

// TypeScript types inferred from schemas
export type ActorInput = z.input<typeof actorSchema>;
export type ActorOutput = z.output<typeof actorSchema>;
export type TargetInput = z.input<typeof targetSchema>;
export type TargetOutput = z.output<typeof targetSchema>;
export type CreateAuditEventInput = z.input<typeof createAuditEventSchema>;
export type CreateAuditEventOutput = z.output<typeof createAuditEventSchema>;
export type QueryAuditEventsInput = z.input<typeof queryAuditEventsSchema>;
export type QueryAuditEventsOutput = z.output<typeof queryAuditEventsSchema>;

