import { expect, test } from 'vitest';
import { relationsToTypeScript } from '../src/cli/commands/introspect';

/**
 * @see https://github.com/drizzle-team/drizzle-orm/issues/6628
 */
test('relationsToTypeScript imports schema with a .js extension for NodeNext', () => {
	const result = relationsToTypeScript(
		{
			tables: {
				users: { foreignKeys: {} },
				posts: {
					foreignKeys: {
						posts_user_id_users_id_fk: {
							name: 'posts_user_id_users_id_fk',
							tableFrom: 'posts',
							columnsFrom: ['user_id'],
							tableTo: 'users',
							columnsTo: ['id'],
						},
					},
				},
			},
		},
		'camel',
	);

	expect(result.file).toContain('from "./schema.js"');
	expect(result.file).not.toContain('from "./schema";');
});
