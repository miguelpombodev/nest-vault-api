import { RefreshTokenRepository } from './refresh_token.repository';

describe('RefreshTokenRepository', () => {
  it('should be defined', () => {
    expect(new RefreshTokenRepository()).toBeDefined();
  });
});
