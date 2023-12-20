---
title: 'Mixtral 8x7B that may pave the Trend to adopt the "Mixture of Experts" Model '
date: 2023-12-20T01:25:25.421Z
author: SOON HENG
authorimage: /img/gshcopy.jpg
thumbnailimage: null
disable: false
tags:
  - "#LLM"
  - "#opensource AI"
  - "#Mixtral 7x8B"
  - "#Mistral"
  - "#AI"
---
On 8th Dec, Mistral AI releases Mixtral 8x7B, a high-quality sparse mixture of experts model (SMoE) with open weights (ref: [Mistral AI](https://mistral.ai/news/mixtral-of-experts/)). What is this Mixtral 8x7B ? In very simple language, basically, it takes 8 x Mixtral 7B models and combined them and make one model. It is a mixture of expert model (MOE). What is a Mixture of Expert Model? Extract from this [paper](https://arxiv.org/pdf/2305.14705.pdf), a MOE models build upon the observation that language models can be decomposed into smaller, specialized sub-models, or "experts", that focus on distinct aspects of the input data, thereby enabling more efficient computation and resource allocation. Why is it popular? Because such AI Models with sparsely activated MOE significantly reduce the computational cost of LLMs.

So, how does it work?If you are into LLM model, you would have know that the most simple representation of a LLM would be an input going into a single model and produce an output. In a MOE model, you have input goes thru' a gateway, which would decide, base on the input context, which of the eight models to be used to process the input. It could be just one model or two or more models processing the input and coordinate to produce the output. A overly simplify pictorial representation is as below.

[![](https://soonhengblog.files.wordpress.com/2023/12/image-6.png?w=900)](https://soonhengblog.files.wordpress.com/2023/12/image-6.png)

In our day-to-day life, it is much like our supervisor looking at the nature of the job and finding the best expert (MOE Model) within his team to complete the task rather than throwing all task to a single person (the traditional LLM model). In this way, it is much efficient except that you now need to maintain eight models instead of one.

Technically, models often reuse the same parameters for all inputs. But MOE models uses different parameters based on the input given. Routing multiple models is not as easy as you think. There is an overhead in communication between the models as well as the routing between them.[ ](https://arxiv.org/abs/2101.03961)This [paper](https://arxiv.org/abs/2101.03961) explain it well. The gating network (typically a neural network), produces a sparse distribution over the available experts. It might only choose the top-k highest-scoring experts, or softmax gating, which encourages the network to select only a few experts. Getting the right balance is not easy, meaning that you may end up choosing the same expert every single time versus evenly distribute it across the experts.

How good is Mixtral 8x7B? According to [mistral AI](https://mistral.ai/news/mixtral-of-experts/), Mixtral 8x7B outperforms Llama 2 70B on most benchmarks with 6x faster inference. It is the strongest open-weight model with a permissive license and the best model overall regarding cost/performance trade-offs. In particular, it matches or outperforms GPT3.5 on most standard benchmarks (see diagram below). You guess it right, it doesn't have performance comparison against GPT 4. Hopefully, we can see one in the near future.

[![](https://soonhengblog.files.wordpress.com/2023/12/image-7.png?w=890)](https://soonhengblog.files.wordpress.com/2023/12/image-7.png)

From the benchmark figure, you can see that even the LLaMA 2 70B parameters can only outperform Mixtral 8x7B parameters score on the WinoGrande and HellaSwag benchmark with only a few percentage. Mixtral also shows improvements in reducing hallucinations and biases in the [TruthfulQA/BBQ/BOLD](https://mistral.ai/news/mixtral-of-experts/) benchmark.

If you look at the post on "X" (below), the filename itself say it all.

[![](https://soonhengblog.files.wordpress.com/2023/12/image-8.png?w=521)](https://soonhengblog.files.wordpress.com/2023/12/image-8.png)

Mixtral 8x7B stands out for its high-quality performance. The model boasts a range of capabilities, including the ability to handle a context of 32k tokens and support for multiple languages, including English, French, Italian, German, and Spanish. Mixtral is a decoder-only sparse mixture-of-experts network. Its architecture enables an increase in parameters while managing cost and latency. Take note that all the expert models are loaded into VRAM which means it require lots of VRAM and superfast. Also, the model only uses a fraction of the total set of parameters per token. According to the [Mistral AI](https://mistral.ai/news/mixtral-of-experts/) , Mixtral has 46.7B total parameters, but it only uses 12.9B parameters per token. What this mean is that it process both input and generate output at same cost as a 12.9B parameters. Hence, it significantly lower LLM computational cost.

Can I deploy one and try it out? Unlikely for most general user unless you have some spare 2 x 80GB 100A or 4 x 40 GB 100A GP lying around or you have it with your cloud provider. However, there are some demo platform that you can go and give it a shot. Here is a list: Perplexity, Poe, Vercel, and Replicate. Below is a screenshot of what I got from Perplexity.

[![](https://soonhengblog.files.wordpress.com/2023/12/image-5.png?w=1024)](https://soonhengblog.files.wordpress.com/2023/12/image-5.png)

Is this something new? Nope. In this [paper](https://ieeexplore.ieee.org/document/6797059) called "Adaptive Mixtures of Local Experts" " written by the GodFather of AI, Geofrrey Hinton back in 1991, already talk about this concept. Like most AI, the advancement in computing technology, the affordability of computational cost and the availability of mass amount of data makes those technology conceptualized in the early days possible now.

So why the sudden interest in "Mixture of Experts"? Well, OpenAI hasn’t publicly commented on the details of the technical specifications for GPT-4 but it’s was shared in the OpenAI Developer community that GPT-4 is a Mixture of Experts (MoE) model. Now, with this release of a Mixtral 8x7B model to the opensource world, will it set a trend for future model developers to embark on a "mixture of expert" path...Who knows? Only time will tell.