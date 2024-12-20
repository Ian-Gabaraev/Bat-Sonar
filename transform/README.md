# Fourier Transform

## It is no wonder one of the most well-known algorithms for working with signals is going to be used in this project. Here I will provide an outline of what Fourier Transform is, how it works and how I am going to use it for BatSonar.

### Discrete Fourier Transform

For real-time signal analysis Discrete Fourier Transform may not be the exact variation of this algorithm, but understanding this will provide the foundation for working with all of them efficiently.

Another important note: I am describing here a loop-based version of DFT, which not used in practice in favor of the much faster, Fast Fourier Transform. But FFT being more complicated, I made a decision to focus on DFT, since, again, the concepts and ideas are similar. 

Still, with the help of CUDA-equipped GPUs and tools like `Cupy` - essentially, `numpy` on CUDA - and the ML framework `PyTorch`, even this basic loop-based DFT can be relatively performant.

### Goal of DFT

The goal of DFT or FFT is the same - decompose a complex signal. In literature, this is often referred to as moving a signal from time domain into frequency domain. And this is a great summary - FFT allows us to sample the signal into constituent frequencies and show their amplitude or power in the signal. This is often visualized as a stem-plot, where frequencies are on the x-axis, and amplitude or power is on the y-axis. This provides us with valuable information of the frequency content of the signal, that, in the case of analysing animal vocalizations can be a digital fingerprint of a species.

### The DFT algorithm

The algorithm consists of the following steps.

First, get a signal. A signal in our case will be a Wave file. We load it with `librosa`:

```
signal, sr = librosa.load("path")
```

Now we have the sampling rate `sr` and the `signal` which is represented as a one-dimensional `numpy` array, or a vector. I will refer to it further on as $\vec{sig}$ to indicate it is a vector.

A `sampling rate` $S_r$ refers to the number of samples taken on a sound signal. $S_r$ needs to follow a rule, where it has to be at least twice as high as the highest frequency in the signal to avoid `aliasing`.

We have $\vec{signal}$ and the $S_r$. The next step is to create a time vector. The length of the vector has to be at twice the $S_r$, and range from 0 to the duration of the signal $S_t$, evenly spaced.

$$
\vec{t} = \begin{bmatrix} 0  & ... & S_t\end{bmatrix}
$$

Now that we have $\vec{t}$, we start the loop.

We iterate over a range of number $[0, \text{len}(\mathbf{\vec{v}})]$

- Choose the current integer $i$ in the iteration as the base frequency $f$
- Create a complex sine wave using Euler's formula

$$

$$




