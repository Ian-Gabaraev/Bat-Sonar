# Digital Audio Processing Primer

## In this document I will outline a number of fundamental concepts and algorithms, and an overview of the python audio processing library `librosa`.

#### Note to self: many of what librosa does, PyTorch can do as well.

### Many of audio-related concepts were described in the rest of the MDs in this repo,so here I will be focusing on the more practical tools rather than pure ideas:

Any of these combined could be features for our model:

 - Mel spectrograms
 - Amplitude envelopes
 - Root Mean Square Energy
 - ZCR
 - Spectral Centroid
 - MFCC

 #### Amplitude Envelopes
 - Provides max $A$ of all samples in a frame
 - Provides a rough idea of loudness
 - Sensitive to outliers
 - Good for onset detection
 - Good for coarse features like detecting the presence of a bat call but not for detailed classification

 #### RMS
 - RMS of all $A$ values in a frame
 - Indicator of loudness
 - Less sensitive to outliers
 - Good for audio segmentation
 - Pre-filtering noisy signals or as a complementary feature

 #### Zero Crossing Rate
 - Shows how often a signal crosses the baseline 0 axis
 - Can be a good indicator of high-frequency signals (common in bat calls), but it doesn't capture harmonic structure or detailed frequency information

 #### Mel Spectrograms
 - Best for CNN-based models or approaches needing detailed frequency content

#### MFCC
- Best for lightweight, compact, and effective feature extraction in traditional ML models (e.g., SVM, random forests)

## Let us explore Mel Spectrograms and MFCCs further

### Mel spectrograms

When you look at a normal sonogram, where frequencies are on the y-axis, and time is on the x-axis, each point in the column tells you how strong each frequency is at a certain point in time. In other words, the change in frequency is linear.

However, there is a problem wit that. And it is because humans to do not perceive change in frequency linearly, but rather logarithmically. That means, that a difference between 100 and 300 hz is way more noticeable to us that between 3000 and 3200 hz. We simply have better resolution at lower frequencies.

This is addressed by the Mel-scale. In a Mel-scale, equal distances between 2 points on the sclae are perceptually equal. So a difference of 200 mels is always perceptually the same regardless of the starting point - unlike in normal sonograms.

The formula to convert $f$ expressed in Hz into Mels $m$:

$$
m = 2595 \times log(1 + \frac{f}{500})
$$

$$
f_{Hz} = 700(10^{\frac{m}{2595}} - 1)
$$

Creating a Mel sonogram:

- Run Fourier Transform on the signal
- Get the amplitudes
- Convert amplitudes/power to DB
  - `librosa.amplitude_to_db`
  - `librosa.power_to_db`
- Convert frequencies to Mel
  - Choose a number of mel bands (ranging from 40 to 120, but the best number is found empirically)
  - Construct Mel filter banks
    - An example with 6 Mel bands. Notice the difference is always the same.
    ![MelBanks](melbanks.png)
  - Apply Mel filter banks to the spectrogram
    - Mathematically, both are matrices of matching dimensions - number of rows in one is equal to number of rows in another, so matrix multiplication is possible. Thus:
    $$
    MelSpectrogram = MelFilterBanks \times Spectrogram
    $$

### MFCC

This is a weird one. First, the terminology.

MFCC - Mel-spectrogram Cepstral Coefficients. Why weird? Well:

 - $Cepstral$ is a word play. `Ceps`-tral = `speC`-tral.
 - $Quefrency$ = frequency
 - $Liftering$ = filtering
 - $Rhamonic$ = harmonic

This whole concept originated in the 60s and was used for seismic signals.

The formula:

$$
C(x(t)) = F^{-1} (log(F[x(t)]))
$$

Where:

$x(t)$ - time-domain signal

$C(x(t))$ - the Cepstrum

$F^{-1}$ - Inverse Fourier Transform

$F[x(t)]$ - Fourier Transform

So, in essence, it is performing FT on the signal, bringing that into a log scale, and then doing the inverse FT on the result. So, it is like a spectrum of a spectrum. That is weird.

So, step-by-step.

- Apply DFT on the signal
- Get the log power spectrum. The result is a $f$ by $P$ plane
![LogPower](logpower.png)
- Now, apply IDFT on this. The result is another plane, but this time the y-axis is magnitude, yet the x-axis is a sort of a frequency known as $quefrency$ measured in milliseconds. The peaks are called $rhamonics$. This $rhamonic$ is a $quefrency$ associated with the fundamental frequency of the log power spectrum.
![Cepstrum](cepstrum.png)
- Apply Mel-scaling
- Apply Cosine Discrete Transform
- Get MFCCs


#### Apparently, Mel Spectrograms and MFCC are the most promising options

---
 As well as the primary audio processing package `librosa`.

 All sound can be categorised in 2 groups: periodic(sine wave) and aperiodic (pulse). The difference lies in whether a period between oscillations is constant or not.

 A partial is a sine wave in a complex sound, also referred to as a harmonic partial.

 Frequency modulations is sort of a way of one sound integrating itself into another one to carry it. Research this more.

 Duration of 1 sample:

 $$
 s_t = \frac{100}{S_r}
 $$

