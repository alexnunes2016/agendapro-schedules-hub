import request from 'supertest';
import app from '../src/app';

describe('GET /admin/statistics', () => {
  it('deve retornar 401 se não houver token', async () => {
    const res = await request(app).get('/admin/statistics');
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  it('deve retornar 403 se o token for inválido', async () => {
    const res = await request(app)
      .get('/admin/statistics')
      .set('Authorization', 'Bearer token_invalido');
    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty('error');
  });

  // Para testar com token válido, defina SUPABASE_JWT_SECRET e gere um token válido
  // it('deve retornar 200 e um objeto de estatísticas se o token for válido', async () => {
  //   const res = await request(app)
  //     .get('/admin/statistics')
  //     .set('Authorization', 'Bearer SEU_TOKEN_JWT_VALIDO');
  //   expect(res.status).toBe(200);
  //   expect(typeof res.body).toBe('object');
  // });
}); 