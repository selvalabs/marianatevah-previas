# Mariana Tevah · prévias da comunidade

Portal com três propostas visuais: **clara**, **escura** e **céu e mar**.

Este repositório de publicação contém os arquivos estáticos em `site/` e a automação mínima para verificá-los e publicá-los. Os fontes Astro e o histórico de desenvolvimento são mantidos separadamente, em ambiente privado. O proprietário autorizou especificamente a publicação deste pacote estático e seu versionamento neste repositório.

As páginas são prévias para revisão, com copy preservada e checkout ainda desabilitado. `noindex` não restringe acesso: arquivos e páginas deste repositório são públicos.

## Verificação e release

```sh
node scripts/verify-publication.mjs
```

O verificador usa apenas módulos nativos do Node: confere inventário, SHA-256 dos arquivos, links locais, isolamento de caminhos, ausência de fontes Astro/ambiente e 12 dobras em cada proposta. `site/integrity.json` e `site/versions-manifest.json` registram a identidade do pacote.

O workflow valida PRs e a `main`. A publicação é manual, com uma tag anotada de um commit aprovado e integrado na `main`. A execução de release confere a tag, SHA, ancestralidade e árvore limpa antes do upload. Criar a tag somente após homologação/merge e preflight; verificar depois o endereço retornado pelo Pages e as três páginas.

Não há dependências de instalação, banco ou processamento de formulários. Primeira publicação: não existe release anterior para rollback. Nas próximas atualizações, preservar e reimplantar a tag anterior aprovada, se necessário.

A issue #5 corrige somente a ordem do destaque verde da mandala de `ceu-mar/`: 01 a 06, com pausas fora da tela, na aba oculta, na pausa manual e com redução de movimento. O manifesto registra a substituição de runtime. Copy, layout e versões clara/escura são preservados; o ajuste visual do sol segue separado no PR #4. A release `v1.0.0-preview.1` permanece como referência de rollback. Nenhuma atualização publica automaticamente: exige homologação, merge e tag anotada.
