/**
 * First checks for NODE_ENV to be production.
 * After that checks for APP_ENV to be production.
 *
 * Why?
 * - Because NODE_ENV can't be changed when building,
 * therefore APP_ENV variable is used to modify environment.
 * For example Cypress uses this to enable CredentialsProvider.
 *
 * @returns whether this is production environment
 */
export const isProduction = () => {
  if (process.env.NODE_ENV !== 'production') {
    return false;
  }
  const appEnv = process.env.APP_ENV ?? 'production';
  return appEnv === 'production';
};
