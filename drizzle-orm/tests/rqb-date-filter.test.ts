import { expect, test } from 'vitest';
import { drizzle } from '~/node-postgres';
import { pgTable, text, timestamp } from '~/pg-core';
import { defineRelations } from '~/relations';

test('RQB date shorthand generates the same SQL as an explicit equality filter', () => {
	const events = pgTable('events', {
		id: text('id').primaryKey(),
		createdAt: timestamp('created_at', { withTimezone: true }),
	});
	const db = drizzle.mock({ relations: defineRelations({ events }) });
	const createdAt = new Date('2026-01-01T00:00:00Z');

	const shorthand = db.query.events.findMany({ where: { id: 'a', createdAt } }).toSQL();
	const explicit = db.query.events.findMany({ where: { id: 'a', createdAt: { eq: createdAt } } }).toSQL();

	expect(shorthand).toStrictEqual(explicit);
	expect(shorthand.params).toStrictEqual(['a', createdAt.toISOString()]);
});
