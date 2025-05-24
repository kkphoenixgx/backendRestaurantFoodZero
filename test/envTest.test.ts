// import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

describe('Variáveis de ambiente', () => {
  it('deve carregar todas as variáveis de ambiente necessárias', () => {
    const keys = [
      'PORT',
      'DB_HOST',
      'DB_PORT',
      'DB_USER',
      'DB_PASSWORD',
      'DB_NAME',
    ];

    let keysRecived : string[] = [];

    keys.forEach(key => {
      const value = process.env[key];
      keysRecived.push(` ${key}: ${value}`);
      expect(value).toBeDefined();
      expect(value).not.toBe('');
    });

    console.log("env keys:" + keysRecived);
    
  });
});