"use client";

import { useState } from "react";

export default function Home() {
const [input, setInput] = useState("");
const [result, setResult] = useState("");
const [loading, setLoading] = useState(false);

const generateContent = async () => {
if (!input.trim()) return;

setLoading(true);
setResult("");

const fullPrompt = `
You are a viral social media expert.

The user topic is: "${input}"

Create:
1. 3 viral Instagram captions
2. 3 short AI video ideas
3. 1 short reel script

Make the response clear and easy to read.

Format:

CAPTIONS
1.
2.
3.

VIDEO IDEAS
1.
2.
3.

REEL SCRIPT
Hook:
Scene 1:
Scene 2:
Scene 3:
Ending:
`;