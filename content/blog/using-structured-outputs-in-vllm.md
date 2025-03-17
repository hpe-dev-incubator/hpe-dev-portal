---
title: Using structured outputs in vLLM
date: 2025-03-16T19:28:00.657Z
author: Ismael Delgado Muñoz
authorimage: /img/Avatar6.svg
thumbnailimage: ""
disable: false
tags:
  - AI
  - GenAI
  - opensource
  - LLM
---
Generating predictable and reliable outputs from large language models (LLMs) can be challenging, especially when those outputs need to integrate seamlessly with downstream systems. Structured outputs solve this problem by enforcing specific formats, such as JSON, regex patterns, or even grammars. vLLM, an open source inference and serving engine for LLMs, supports structured outputs since some time ago, but there were no documentation on how to use it supported this since some time ago, but there were no documentation on how to use it, and that´s why I decided to do a contribution and write the [Structured Outputs documentation page](https://docs.vllm.ai/en/latest/usage/structured_outputs.html).

## Why structured outputs?

LLMs are incredibly powerful, but their outputs can be inconsistent when a specific format is required. Structured outputs address this issue by restricting the model’s generated text to adhere to predefined rules or formats, ensuring:

1. **Reliability:** Outputs are predictable and machine-readable.
2. **Compatibility:** Seamless integration with APIs, databases, or other systems.
3. **Efficiency:** No need for extensive post-processing to validate or fix outputs.

Imagine we have an external system which receives a JSON with the all the details to trigger an alert, and we want our LLM-based system to be able to use it. Of course we can try to explain the LLM what should be the output format and that it must be a valid JSON, but LLMs are not deterministic and thus we may end up with an invalid JSON. Probably, if you have tried to do something like this before, you would have found yourself in this situation.

How these tools work? The idea is that we´ll be able to filter the list of possible next tokens to force that we are always generating a token that is valid for the desired output format.

![Structured outputs in vLLM](/img/structured_outputs_thumbnail.png "Structured outputs in vLLM")

## What is vLLM?

vLLM is a state-of-the-art, open-source inference and serving engine for LLMs. It’s built for performance and simplicity, offering:

* **PagedAttention:** An innovative memory management mechanism for efficient attention key-value handling.
* **Continuous batching:** Supports concurrent requests dynamically.
* **Advanced optimizations:** Includes features like quantization, speculative decoding, and CUDA graphs.

These optimizations make vLLM one of the fastest and most versatile engines for production environments.

## Structured outputs on vLLM

vLLM extends the OpenAI API with additional parameters to enable structured outputs. These include:

* **guided_choice:** Restricts output to a set of predefined choices.
* **guided_regex:** Ensures outputs match a given regex pattern.
* **guided_json:** Validates outputs against a JSON schema.
* **guided_grammar:** Enforces structure using context-free grammars.

Here’s how each works, along with example outputs:

### **1. Guided choice**

Simplest form of structured output, ensuring the response is one of a set of predefined options.

```python
from openai import OpenAI

client = OpenAI(base_url="http://localhost:8000/v1", api_key="-")

completion = client.chat.completions.create(
    model="Qwen/Qwen2.5-3B-Instruct",
    messages=[
        {"role": "user", "content": "Classify this sentiment: vLLM is wonderful!"}
    ],
    extra_body={"guided_choice": ["positive", "negative"]},
)
print(completion.choices[0].message.content)
```

**Example output:**

```
positive
```

### **2. Guided Regex**

Constrains output to match a regex pattern, useful for formats like email addresses.

```python
completion = client.chat.completions.create(
    model="Qwen/Qwen2.5-3B-Instruct",
    messages=[
        {
            "role": "user",
            "content": "Generate an example email address for Alan Turing at Enigma. End in .com.",
        }
    ],
    extra_body={"guided_regex": r"\w+@\w+\.com\n", "stop": ["\n"]},
)
print(completion.choices[0].message.content)
```

**Example output:**

```
alan.turing@enigma.com
```

### **3. Guided JSON**

Enforces a valid JSON format based on a schema, simplifying integration with other systems.

```python
from pydantic import BaseModel
from enum import Enum

class CarType(str, Enum):
    sedan = "sedan"
    suv = "SUV"
    truck = "Truck"
    coupe = "Coupe"

class CarDescription(BaseModel):
    brand: str
    model: str
    car_type: CarType

json_schema = CarDescription.model_json_schema()

completion = client.chat.completions.create(
    model="Qwen/Qwen2.5-3B-Instruct",
    messages=[
        {"role": "user", "content": "Generate a JSON for the most iconic car from the 90s."}
    ],
    extra_body={"guided_json": json_schema},
)
print(completion.choices[0].message.content)
```

**Example output:**

```json
{
  "brand": "Toyota",
  "model": "Supra",
  "car_type": "coupe"
}
```

### **4. Guided grammar**

Uses an Extended Backus–Naur Form (EBNF) grammar to define complex output structures, such as SQL queries.

```python
completion = client.chat.completions.create(
    model="Qwen/Qwen2.5-3B-Instruct",
    messages=[
        {"role": "user", "content": "Generate a SQL query to find all users older than 30."}
    ],
    extra_body={
        "guided_grammar": """
        query ::= "SELECT" fields "FROM users WHERE" condition;
        fields ::= "name, age" | "*";
        condition ::= "age >" number;
        number ::= [0-9]+;
        """
    },
)
print(completion.choices[0].message.content)
```

**Example output:**

```sql
SELECT * FROM users WHERE age > 30;
```

## **Next steps**

To start integrating structured outputs into your projects:

1. **Explore the documentation:** Check out the official documentation for more examples and detailed explanations.
2. **Install vLLM locally:** Set up the inference server on your local machine using the vLLM GitHub repository.
3. **Experiment with structured outputs:** Try out different formats (choice, regex, JSON, grammar) and observe how they can simplify your workflow.
4. **Deploy in production:** Once comfortable, deploy vLLM to your production environment and integrate it with your applications.

Structured outputs make LLMs not only powerful but also practical for real-world applications. Dive in and see what you can build!