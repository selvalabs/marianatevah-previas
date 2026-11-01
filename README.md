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

Não há dependências de instalação, banco ou processamento de formulários. A release publicada `v1.0.0-preview.1` permanece como referência para rollback; uma atualização só substitui o site após homologação, merge e publicação por nova tag.

O ajuste da issue #3 dá mais presença ao sol e ao mar na versão `ceu-mar/`, principalmente no celular. O manifesto registra o commit do gerador e os hashes das duas substituições de fonte. Os arquivos das versões clara e escura permanecem idênticos à release anterior. Assets antigos com hash são preservados para cache e reversão e continuam incluídos no inventário de integridade.
