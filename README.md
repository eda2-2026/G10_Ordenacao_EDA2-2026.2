# AutoSort

**Conteúdo da disciplina:** Ordenação — Estruturas de Dados 2 (2026.2), grupo G10.

## Alunos

| Matrícula | Aluno |
| --- | --- |
| — | Enzo Menali |
| 241025971 | Paulo Vitor Gomes |

## Sobre

O AutoSort é um catálogo de veículos, inspirado em sites de classificados como a Webmotors, usado como aplicação prática para implementar e comparar algoritmos de ordenação.

O usuário escolhe:

- o **algoritmo**: Insertion Sort, Merge Sort, Quick Sort ou Heap Sort;
- o **critério**: marca, modelo, preço, ano ou quilometragem;
- a **ordem**: crescente ou decrescente;
- a **quantidade** de veículos: 20, 100, 1.000 ou 10.000.

Além da lista ordenada, a aplicação mostra o tempo de execução e quantas comparações, trocas e movimentações o algoritmo fez. Uma seção de comparação executa os quatro algoritmos sobre a mesma entrada, que pode ser aleatória, já ordenada ou em ordem inversa, e mostra os resultados lado a lado.

Os algoritmos foram implementados manualmente. A aplicação usa só JavaScript, HTML e CSS, sem frameworks nem dependências externas.

## Algoritmos

| Algoritmo | Melhor caso | Caso médio | Pior caso | Memória extra | Estável |
| --- | --- | --- | --- | --- | --- |
| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) | Sim |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | Sim |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) em média | Não |
| Heap Sort | O(n log n) | O(n log n) | O(n log n) | O(1) | Não |

- **Insertion Sort** ([insertionSort.js](src/sorting/algorithms/insertionSort.js)): percorre a lista e insere cada elemento na posição certa da parte já ordenada, deslocando os maiores uma posição para a direita.
- **Merge Sort** ([mergeSort.js](src/sorting/algorithms/mergeSort.js)): versão recursiva *top-down*. Divide a lista ao meio e intercala as metades ordenadas usando um vetor auxiliar, criado uma única vez. Em caso de empate, o elemento da metade esquerda vem primeiro, o que torna a ordenação estável.
- **Quick Sort** ([quickSort.js](src/sorting/algorithms/quickSort.js)): usa como pivô o elemento do meio da faixa e particiona com dois índices que avançam um em direção ao outro, no esquema de Hoare. Com o pivô no meio, listas já ordenadas ou invertidas não caem no pior caso.
- **Heap Sort** ([heapSort.js](src/sorting/algorithms/heapSort.js)): transforma a lista em um heap máximo e, a cada passo, troca a raiz (o maior elemento) com o último elemento da parte não ordenada, depois restaura o heap. A descida no heap é iterativa.

Todos seguem a mesma assinatura, `algoritmo(arr, compare, metrics)`, e são registrados em [src/sorting/algorithms/index.js](src/sorting/algorithms/index.js).

### Como as métricas são contadas

As regras estão em [src/sorting/metrics.js](src/sorting/metrics.js) e valem para os quatro algoritmos:

- **Comparação:** cada chamada ao comparador entre dois veículos. Os algoritmos só comparam por meio do comparador, que é envolvido por um contador. Assim, nenhuma comparação deixa de ser contada.
- **Movimentação:** cada cópia de um elemento, inclusive para uma variável temporária ou para o vetor auxiliar do Merge Sort.
- **Troca:** um intercâmbio efetivo entre duas posições diferentes. Cada troca conta também como 3 movimentações.
- **Tempo:** medido com `performance.now()` apenas durante a execução do algoritmo. A cópia da lista de entrada fica fora da medição.

### Critérios de ordenação

Os comparadores ficam em [src/sorting/comparators.js](src/sorting/comparators.js):

- **Marca e modelo:** ordem alfabética do português, sem diferenciar maiúsculas de minúsculas nem considerar acentos. Por exemplo, "Citroën" e "citroen" empatam.
- **Preço, ano e quilometragem:** ordem numérica.
- **Valores ausentes** (`null`, `undefined` ou `NaN`) ficam sempre no fim, tanto na ordem crescente quanto na decrescente.

## Dados

- **Veículos sintéticos** ([src/data/syntheticVehicles.js](src/data/syntheticVehicles.js)): a interface e o benchmark usam um gerador com semente fixa. Os mesmos parâmetros produzem sempre os mesmos veículos, e é possível gerar listas maiores que um dataset real. O catálogo inicial ([data/sample-vehicles.json](data/sample-vehicles.json)) tem 20 veículos.
- **Dataset da Webmotors (opcional):** o projeto também normaliza a [amostra de 1.000 anúncios da Bright Data](https://github.com/luminati-io/Webmotors-dataset-sample). Para usá-lo, coloque o CSV em `data/raw/Webmotors-dataset-sample.csv` e rode `npm run data`. A normalização ([src/data/vehicles.js](src/data/vehicles.js)) mantém apenas os dados do veículo e descarta telefone, CPF/CNPJ, nome do vendedor e descrição.

## Instalação

**Pré-requisito:** [Node.js](https://nodejs.org/) 20 ou superior. Não há dependências para instalar.

```bash
git clone https://github.com/eda2-2026/G10_Ordenacao_EDA2-2026.2.git
cd G10_Ordenacao_EDA2-2026.2
```

## Uso

### Interface

```bash
npm start
```

Abra <http://127.0.0.1:4173> no navegador. A página precisa ser servida por HTTP, porque usa módulos JavaScript e carrega os dados com `fetch`. Por isso, abrir o `index.html` diretamente pelo sistema de arquivos não funciona.

1. Em **Configure a ordenação**, escolha quantidade, algoritmo, critério e ordem e clique em **Ordenar catálogo**. Aparecem as métricas da execução e os primeiros 20 veículos ordenados.
2. Em **Comparação entre algoritmos**, escolha o tipo de entrada e clique em **Comparar algoritmos**. A comparação usa a quantidade, o critério e a ordem escolhidos acima e mostra uma tabela com barras proporcionais; o menor valor de cada métrica aparece destacado.

No navegador, o relógio tem precisão reduzida, de cerca de 0,1 ms. Com 20 ou 100 veículos os tempos podem empatar; nesses casos, compare pelas contagens ou use o benchmark no terminal.

### Testes

```bash
npm test
```

Usa o executor de testes nativo do Node (`node:test`), com 122 testes. Além dos testes específicos de cada algoritmo, com contagens exatas de métricas, o helper [tests/sorting/helpers.js](tests/sorting/helpers.js) valida todos os algoritmos registrados nos casos abaixo:

- lista vazia e lista com um elemento;
- lista já ordenada e lista em ordem inversa;
- muitos valores duplicados;
- textos equivalentes para o comparador;
- lista aleatória;
- valores ausentes.

Cada caso roda nos 5 critérios e nas 2 ordens. Durante esses testes, `Array.prototype.sort` e `toSorted` são bloqueados, o que garante que nenhum algoritmo usa ordenação pronta.

### Benchmark no terminal

```bash
npm run benchmark
npm run benchmark -- --sizes=100,1000,10000 --field=price --order=asc --reps=5 --csv=resultados.csv
```

Executa os quatro algoritmos sobre as mesmas entradas, nos cenários aleatório, já ordenado e invertido, e imprime uma tabela por cenário. O tempo é a mediana das repetições, e a opção `--csv` salva os resultados.

### Outros comandos

| Comando | Descrição |
| --- | --- |
| `npm run data` | Normaliza o CSV da Webmotors em `data/vehicles.json` |
| `npm run data:generate -- 100 data/vehicles.json 2026` | Gera veículos sintéticos (quantidade, arquivo de saída, semente) |

## Resultados

Resultados com 10.000 veículos ordenados por preço em ordem crescente. Foram obtidos com `npm run benchmark -- --reps=5`, no Node.js 22, em Linux. Comparações, trocas e movimentações são determinísticas; o tempo é a mediana de 5 execuções e varia de máquina para máquina.

| Entrada | Algoritmo | Comparações | Trocas | Movimentações | Tempo |
| --- | --- | ---: | ---: | ---: | ---: |
| Aleatória | Insertion Sort | 25.116.697 | 0 | 25.126.701 | 451,2 ms |
| | Merge Sort | 120.423 | 0 | 267.232 | 2,5 ms |
| | Quick Sort | 157.957 | 38.294 | 122.341 | 1,5 ms |
| | Heap Sort | 235.376 | 124.117 | 372.351 | 2,6 ms |
| Já ordenada | Insertion Sort | 9.999 | 0 | 19.998 | 0,3 ms |
| | Merge Sort | 69.008 | 0 | 267.232 | 1,8 ms |
| | Quick Sort | 131.861 | 18.583 | 63.305 | 1,0 ms |
| | Heap Sort | 229.442 | 122.448 | 367.344 | 2,1 ms |
| Ordem inversa | Insertion Sort | 49.857.798 | 0 | 49.868.425 | 1.009,8 ms |
| | Merge Sort | 76.272 | 0 | 267.232 | 2,1 ms |
| | Quick Sort | 131.856 | 23.579 | 78.297 | 1,2 ms |
| | Heap Sort | 225.810 | 116.061 | 348.183 | 2,1 ms |

### Análise

- **O Insertion Sort é quadrático, exceto em listas já ordenadas.**
  - Com entrada aleatória, fez cerca de 25 milhões de comparações, perto de n²/4, e foi de 170 a 300 vezes mais lento que os demais.
  - Com entrada invertida, o número de comparações praticamente dobra, chegando perto de n²/2. Não chega a exatamente n(n−1)/2 porque há preços repetidos no conjunto.
  - Com a lista já ordenada, faz só n − 1 = 9.999 comparações e é o mais rápido dos quatro. Esse comportamento adaptativo é a principal vantagem dele.
- **O Merge Sort é o mais previsível.** Faz sempre as mesmas 267.232 movimentações, porque em cada nível da recursão copia todos os elementos para o vetor auxiliar e os devolve, qualquer que seja a entrada. Só o número de comparações varia, e é menor quando uma das metades se esgota cedo.
- **O Quick Sort foi o mais rápido nas entradas aleatória e invertida**, mesmo fazendo mais comparações que o Merge Sort. Ele movimenta bem menos elementos e trabalha no próprio array. O pivô no meio da faixa evita o pior caso O(n²) em listas já ordenadas ou invertidas. Esse pior caso ainda existe para outras entradas, construídas de propósito.
- **O Heap Sort faz o maior número de comparações e de trocas entre os algoritmos O(n log n)**, e o resultado quase não muda com a entrada. Em troca, tem pior caso garantido O(n log n) sem memória extra, o que nem o Quick Sort (pior caso) nem o Merge Sort (vetor auxiliar) oferecem.
- **Contagem de operações e tempo nem sempre andam juntos.** O Merge Sort faz menos comparações que o Quick Sort, mas é mais lento por causa das cópias para o vetor auxiliar. Por isso a aplicação mostra as duas medidas.

## Estrutura do projeto

```text
├── index.html                  # página do catálogo
├── data/
│   └── sample-vehicles.json    # 20 veículos sintéticos exibidos inicialmente
├── scripts/
│   ├── serve.js                # servidor estático (npm start)
│   ├── benchmark.js            # benchmark no terminal (npm run benchmark)
│   ├── prepare-data.js         # normaliza o CSV da Webmotors (npm run data)
│   └── generate-data.js        # gera veículos sintéticos (npm run data:generate)
├── src/
│   ├── app.js                  # integração da interface
│   ├── styles.css
│   ├── sorting/
│   │   ├── algorithms/         # Insertion, Merge, Quick e Heap Sort + registro
│   │   ├── comparators.js      # comparadores e critérios de ordenação
│   │   ├── metrics.js          # contadores de comparações, trocas e movimentações
│   │   └── runner.js           # executa um algoritmo e mede o desempenho
│   ├── analysis/benchmark.js   # compara os algoritmos em vários cenários
│   ├── data/                   # leitor de CSV, normalização e gerador sintético
│   └── ui/                     # renderização do catálogo, das métricas e da comparação
└── tests/                      # testes automatizados (node:test)
```

## Divisão do trabalho

| Integrante | Contribuições principais |
| --- | --- |
| Enzo Menali | Estrutura inicial do projeto; Insertion Sort e Quick Sort; contagem de trocas e movimentações; gerador de veículos sintéticos; catálogo e controles da interface |
| Paulo Vitor Gomes | Comparadores e critérios de ordenação; métricas e runner; registro de algoritmos; Merge Sort e Heap Sort; normalização do dataset; benchmark e comparação na interface |

## Apresentação

Vídeo de apresentação: *em produção*.
