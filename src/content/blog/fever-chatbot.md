---
title: "A Conversational Chatbot for the FEVER Project"
date: 2026-10-01
image: "/images/news/fever-chatbot.jpg"
author: george-hutchinson
members:
  - { name: "Fola Olagundoye" }
  - ezhilarasi-periyathambi
  - sebastian-stein
  - bruno-arcanjo
  - zhaoxing-li
  - { name: "Professor Andy Cruden", url: "https://www.southampton.ac.uk/people/5x99mf/professor-andrew-cruden" }
---

Over the summer, we have been working on a chatbot to explain FEVER. This chatbot was developed by Fola and me as part of a summer internship, with lots of help from people working in CCAIS and FEVER. Its core intention is to give information about the FEVER project, and answer questions and concerns about electric vehicles and renewable energy in general.

For those who don't know, FEVER (Future Electric Vehicle Energy networks supporting Renewables) is a research project focused on the development of off-grid, renewables-powered EV charging points. It is a multi-university project aiming to reduce the strain on the electrical grid that would come with widespread use of electric vehicles. One of these charging points has already been set up as a proof-of-concept and another is being developed. You can read more on our [FEVER project page](/projects/future-electric-vehicle-energy-networks-supporting-renewables-fever/) or at [fever-ev.ac.uk](https://www.fever-ev.ac.uk).

The chatbot combines RAG (Retrieval Augmented Generation) with tool calling. This means that instead of outputting a response directly, the chatbot has a tool choosing step (where tools are normally non-AI functions that retrieve extra information), then calls those tools, then uses the information received to generate the response. This chatbot has two main types of tools. The first looks up information from a premade database of text found on the FEVER website and other related sources, such as the National Grid. The second type is designed to use real-time information from FEVER charging points, such as whether they are in use or currently available. This makes the chatbot more likely to be grounded in facts, and better at answering specifically FEVER-related questions.

One of the most difficult parts of the project was testing, because it is hard to define what a good response looks like. The tool calls were automatically tested as it was relatively easy to define what the correct tool calls were for a question. The real text output was also automatically tested on faithfulness (how well the output matched the retrieved information) and other metrics using AI models as a judge. Answers were also frequently tested manually.

The chatbot is nearing the end of development and we are trying to plan a focus group-style event to test its effectiveness.
