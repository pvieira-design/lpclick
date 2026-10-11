# Depoimentos aprovados para novas páginas

Decisão do usuário em 24/09/2026: nas próximas páginas, utilizar exclusivamente os relatos classificados como “Manter integral” e “Com corte” na triagem das 122 avaliações. As versões com cortes propostas nessa triagem foram autorizadas para uso futuro.

## Base de uso

Importar `APPROVED_TESTIMONIALS` de `@/lib/approvedTestimonials`.

A base contém **174 relatos: 117 integrais e 57 excertos**. Em 25/09/2026, o usuário autorizou adicionar os 40 integrais e as 22 versões com cortes da coleta por vídeo. Os 112 registros anteriores foram preservados; duplicados, excluídos e pendentes da coleta não entraram. Cada registro contém nome, texto final aprovado, foto quando disponível, tags, data exata ou aproximada, versão (`full`/`excerpt`) e ID da avaliação no relatório histórico. Os textos foram copiados e congelados para que alterações na base bruta não reintroduzam trechos excluídos.

```tsx
import { APPROVED_TESTIMONIALS } from "@/lib/approvedTestimonials";

const reviews = APPROVED_TESTIMONIALS.slice(0, 10);
// Ao renderizar novos registros, usar approximateDate.displayLabel se houver.
// photo vazio: usar iniciais; publishedAt vazio: não passar para new Date().
```

- Selecionar um subconjunto conforme a página; não é necessário exibir todos.
- Usar o campo `text` exatamente como salvo. Preservar `[…]` nos excertos.
- Não importar `TEXT_TESTIMONIALS` de LP4/LP5 para uma nova página nem copiar listas antigas ao clonar uma LP. Adaptar o componente clonado para esta base.
- Não preencher lugares vagos com relatos da base original. Os 9 classificados como “Deixar de fora” e Fabio sá (autoria pendente) não integram a seleção.
- Didi da Silva e Suze Costa são incluídos apenas nas versões cortadas aprovadas, recuperadas do histórico. Não restaurar seus textos integrais.
- Arthur Marques deve usar a versão com omissão da afirmação de cura.
- Manter as decisões expressas do usuário, inclusive Verista Convicto. A aprovação é editorial, não comprova afirmações médicas dos relatos.
- Não alterar nome, foto, data, autoria ou atribuir condições que não aparecem no relato. Tags legadas não substituem a leitura do texto.
- Se houver necessidade de outra edição ou de um novo depoimento, apresentar para aprovação antes de acrescentar à base.

## Limites desta alteração

Esta regra vale para as próximas páginas. Não migra automaticamente páginas existentes nem muda as seleções já publicadas da bio/LP13. A base bruta histórica continua separada para referência.

A `/inicio` foi ligada explicitamente a esta base em 24/09/2026. Sua seleção foi ampliada para 32 relatos na página: oito sobre sono e seis para cada um dos outros quatro objetivos. O pop-up mostra até quatro relatos do objetivo escolhido. Os cards da página e do pop-up leem os mesmos textos congelados daqui. Didi da Silva e Suze Costa seguem fora da seleção da `/inicio`, conforme decisão anterior do usuário.

Os vídeos ainda não têm transcrição localizada. Não criar citações a partir de resumos ou metadados; seguir o plano de transcrição e revisão antes de aprovar conteúdo derivado de vídeo. Não atribuir a esses futuros trechos origem Google ou estrelas inventadas.

## Rastreabilidade

- Triagem completa: `reports/depoimentos/triagem-122-avaliacoes-2026-09-24.md`.
- Dados da triagem: `reports/depoimentos/triagem-122-avaliacoes-2026-09-24.json`.
- Universo histórico: 122 avaliações no commit `d905917`.
- A base bruta local continha 120 no momento da análise; os dois ausentes foram recuperados somente para a triagem e a seleção aprovada.


## Lote aprovado em 25/09/2026 — avaliações coletadas por vídeo

- 62 adições: 40 versões integrais e 22 com os cortes já aplicados diretamente em `text`. O consumidor não precisa recortar o depoimento.
- Os 5 duplicados, 4 excluídos, 4 pendências editoriais, 3 incompletos e 33 nomes auxiliares sem original recuperado ficaram fora.
- `sourceReviewId` continua único; `sourceCollection` e `sourceRecordId` localizam a avaliação no relatório desta coleta. `sourceEvidence` aponta para o quadro usado na conferência, não para uma imagem a exibir na página.
- `rating` registra as cinco estrelas observadas e `approvedAt` registra a autorização em 25/09/2026.
- `publishedAt` é vazio nos 62 novos registros porque não temos o dia exato. `approximateDate.month` contém YYYY-MM; `originalLabel` preserva a expressão do Google; `kind` distingue publicação de edição; `displayLabel` já traz mês/ano com “aproximadamente” e “Atualizado em” quando aplicável. Não tratar atualização como prova da primeira publicação em 2026.
- `photo` é vazio nos novos registros, pois não temos a URL da foto. Quando forem selecionados para uma página, usar iniciais ou apresentação sem foto; nunca fabricar URL nem mostrar o print como card.
- As tags novas descrevem apenas temas presentes no texto final. “Sono”, por exemplo, não diagnostica insônia; verificar o texto ao selecionar por objetivo.
- Nenhum componente, seleção de página ou publicação foi alterado. As páginas atuais selecionam nomes específicos; os novos registros foram acrescentados ao final do banco.
- Antes de selecionar esses novos relatos em uma página futura, o componente deve aceitar data aproximada e foto ausente. Componentes antigos que formatam `publishedAt` sem verificar vazio não devem receber esses registros sem adaptação.

Relatório de origem: [revisão da coleta](../reports/depoimentos/coletas/2026-09-24-video-google/REVISAO.md). Os vídeos mencionados anteriormente como sem transcrição são depoimentos audiovisuais de pacientes; esta coleta foi uma gravação de tela das avaliações escritas do Google.
