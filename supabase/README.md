# Supabase Configuration

Este diretório contém todas as configurações e recursos do Supabase para o AgendoPro.

## Estrutura

```
supabase/
├── config.toml           # Configuração principal do Supabase
├── import_map.json      # Mapa de importação para Edge Functions
├── functions/           # Edge Functions do Supabase
│   ├── types/          # Tipos compartilhados
│   └── utils/          # Utilitários compartilhados
├── migrations/         # Migrações do banco de dados
└── README.md          # Esta documentação
```

## Configurações

### Autenticação

- JWT expira em 2 horas
- Rotação de refresh tokens habilitada
- Confirmação de email obrigatória
- Senha mínima de 10 caracteres
- Login social: Google, Facebook e Apple

### Storage

- Limite de arquivo: 100MB
- Limite diário: 1GB
- Tipos MIME permitidos:
  - Imagens (JPEG, PNG, GIF)
  - PDF
  - Documentos Office

### Database

- Pool de conexões habilitado
- Máximo de 200 conexões simultâneas
- Pool size padrão: 30

### Edge Functions

- Timeout: 60 segundos
- JWT verificação obrigatória
- CORS configurado
- Tipos e utilitários compartilhados

## Ambientes

### Desenvolvimento

```bash
supabase start
supabase functions serve
```

### Produção

URLs:
- API: https://api.agendopro.com.br
- App: https://app.agendopro.com.br
- Admin: https://admin.agendopro.com.br

## Migrações

Para aplicar migrações:

```bash
./apply_migrations.sh
```

## Segurança

- Todas as funções verificam JWT
- Cookies seguros e HttpOnly
- CORS configurado adequadamente
- SSL/TLS obrigatório

## Monitoramento

- Analytics habilitado
- Vector habilitado para métricas
- Logs disponíveis no dashboard

## Manutenção

Para atualizar as configurações:

1. Edite os arquivos relevantes
2. Execute `supabase db reset` em desenvolvimento
3. Teste as alterações
4. Crie uma nova migração se necessário
5. Aplique em produção

## Troubleshooting

Problemas comuns e soluções:

1. Erro de conexão:
   ```bash
   supabase stop && supabase start
   ```

2. Limpar cache:
   ```bash
   supabase db reset
   ```

3. Logs:
   ```bash
   supabase logs
   ```

## Contato

Para questões relacionadas à infraestrutura:
- Email: suporte@agendopro.com.br 