# $$Bat Sonar Project$$ 
## $$inspired-by-nature$$ 

#### This is an ambitious project, that I decided to embark on as a learning opportunity before my main "passivesonar" effort. In this document, I will outline the goals and approaches to the task at hand, along with a degree of mathematics behind them.



## Why bats?
Bats are fascinating creatures. As much as they are different in all possible way or form from cetaceans like orcas, dolphins and whales, these two major groups of species share one fundamental skill that is the very core of their survival. And that skill is echolocation.

The evolutionary mechanisms of how bats and cetaceans developed this sophisticated ability are beyond the scope of this project, although one factor is obvious - both hunt in darkness. Bats usually come out at twilight and go on with their feeding for the rest of the evening, while large whales like the sperm whale dive down to over a thousand meters looking for the ultimate treat - the giant squid. 

As a scuba diver, one thing I know for a fact is that light does not penetrate water too deep. Most times it gets pretty dark when you hit 50 meters, and past 300 meters it is universally known to be a no-light zone. The hunting grounds of sperm whales are way beyond that limit, so pitch darkness is why and where they need echolocation.

Again - why bats and not whales? For a few reasons, number one being accessibility and opportunity to gather and analyze my own data. See, capturing whale songs is one hell of an endevour, dependent on so many things it is only possible for large-scale operations with specialized vessels. With bats, all I need is a ultrasonic microphone and a cave. Luckily, caves in South East Asia are not uncommon, and ultrasonic mics can be purchased for a few hundred dollars a piece.

## What am I trying to do?
The goal of this project is to have an open-source platform that will offer several key features:

- Real-time monitoring of bat vocalizations
- Real-time classification of bat vocalizations
- Post-recording analysis
- Species identification

## Platform
The code of the backend will be in Python. However, it is going to require a number of dependencies
- `Librosa`: for analyzing the recordings
- `Numpy`: for mathematical operations
- `Pandas`: for working with datasets
- `PyTorch`: for the ML models
- `Audacity`: to prepare the learning dataset
- `Docker`: for what docker is good for

Ideally, this should be able to run on anything as small as the Raspberry Pi 4 with 4gb of RAM.

---
#### Now that the objectives and motivations are established, I am moving on to the science behind this. I partly do it for my own benefit to have a reference, because preparing for this has already required hundreds of hours of reading books, researching, writing code, binge-watching Coursera, you name it. It's been fun, though, I've absolutely loved it.

## Sound signal primer

The `wavelength` $\lambda$ is the length of one cycle of the wave: distance between two peaks.

The `amplitude` aka `sound pressure` $A$ is related to the perceived loudness of a signal. In other words, it shows the amount of energy/power contained in a signal. The formula of the power of signal $P$:

$$ P = A^2 $$

The `frequency` $F$ refers to the rate of oscillation of the sound wave per second. For example, a 20hz signal oscillates (completes a cycle) 20 times per second.

Human hearing frequency range is modest, ranging from 20hz to 20kHz. Although most people will hear sounds up to 16-17kHz max. 

The `sampling rate` $S_r$ refers to the number of samples taken on a signal per second. A signal with $S_r$=50 will be evenly sampled 50 times per 1-second worth of signal. Generally, the higher the $S_r$, the better the quality of the signal, and the more information is preserved. However, $S_r$ is based on another rule called the `Nyquist`. Think of sampling a soundwave as slicing pizza. With a high $S_r$ you will end up with many thin slices. Now, doing that barely makes any sense in a case of a pizza, but when it comes to sound, more 'slices' mean more accurate representation of a signal, since each such 'slice' is a specific point on the wave.

The `Nyquist frequency` $F_n$ is a term from the Nyquist theorem that states, that in order to accurately sample a signal, its sampling rate $S_r$ has to be at least 2x higher than the highest frequency present in the signal.

$$ S_r = \frac{max(F)}{2} $$
$$ F_n = \frac{S_r}{2} $$

In practice, we should always allow for more space, so a realistic sampling rate should be:
$$S_r = F_n * 2.5$$

For instance, if we are recording bat calls that have $F$ ~ 80kHz, our sampling rate needs to be at least 200kHz:
$$F * 2.5 = 80 * 2.5 = 200 $$


The `Bit Depth` $Q$ refers to the range of values each point of a signal can take. If you imagine a sound signal as a continuous wave, when you sample that wave, you are essentially trying to trace the movement of that signal by marking it with dots. Each such 'dot' has a numerical value. The higher your $Q$, the more bandwith you allocate for each point of the signal. The most common $Q$ are 16-bit or 32-bit, although oftentines 16 is more than enough. Higher $Q$ also results in larger file size.

$$ size(bytes) = \frac{(S_rQCT)}{8}$$

Where $S_r$ is the sampling rate, $Q$ is bit depth, $C$ is number of channels and $T$ is duration in seconds.


The `Sine Wave` is a fundamental idea of digital audio. Any real-life audio recording is a product of many sine waves combined together. The formula for a basic sine wave is as follows:

$$ A*sin(2\pi ft + \phi) $$

Where $A$ is `amplitude`, $f$ is `frequency`, $\pi$ is the Pi number ~ `3.14`, $t$ is the `time vector` and $\phi$ is the `phase`.

The `Frame` is simply a collection of samples. Frames allow processing samples in chunks, with common frame size ranging from 256 to 8192 samples.

`Quantization` is another fundamental concept closely related to `Bit Depth`. Quantization is a process of mapping analogue values to a limited range of discrete values. To visualise, imagine a sine wave traveling through space. If we want to accurately sample that wave and represent it digitally, we need to put that wave against a background, and draw horizontal lines from the bottom to the top. The more such lines or levels we have, the more accurately we can reconstruct a signal. The number of such levels is directly determined by bit depth `Q`. If we have `Q`=8, that is $2^8 = 256$ levels. Each of those 256 levels can be used to track the movement of the sine wave.

The `Doppler Shift` describes an effect where a continous, constant-rate signal may appear faster or slower depending on the speed of movement of the listener and the source of sound. Essentially, as we get closer to the source of the sound, signals arrive faster, although their frequency does not change. This change of frequency can be formulated as follows:

$$ \Delta f = (\frac{(c + v)}{c})*c $$

Where $c$ is the speed of sound in air m/s, $v$ is the speed of the source of sound (bat) m/s, and $f$ is the emitted frequency.

| There is a variety of ways to represent a digital signal, namely `oscillograms`, `power spectra` and   `sonograms` aka `spectrograms`. 

`Oscillograms` show time against amplitude, `power spectra` show frequency again time, and `sonograms/spectrograms` display time against frequency with amplitude being represented by colour intensity.

`FFT` - Fast-Fourier Transform. This is one of the more technical aspects of digital audio processing that is relatively math-heavy, but not impossible to understand. First, why do we need it?

FFT is an algorithm that allows us to move a signal from **time domain** to **frequency domain**. If you think about it, any audio signal can be illustrated on a cartesian plane, where the x-axis is time, and the y-axis is amplitude. That is **signal in a time domain**. Although useful, it does not tell us what frequencies are contained in the signal, which is critical information in we are analyzing bat vocalizations.

That is where `FFT` comes into play. Fourier-transform essentially decomposes the original signal into its frequencies, which allows us to plot them on a cartesian plane, where x-axis has the frequencies, and y-axis shows their relative amplitude. This provides a clear picture of how much of a specific frequency is contained in the signal. 

That is the basic idea. Keep reading to learn about the math behind the Fourier Transform or skip to the next chapter.

## Bat science

Much of what I've learned about these animals is from a fantastic book by Jon Russ `British Bat Calls`. In this paragraph I will be quoting him extensively. Although the title specifically refers to bats found in  Britain, the fundamentals of bat communication are the same across the world. 

This project has originated during my time in South-East Asia - specifically, central Vietnam, in city of Da Nang along the coast of the South China Sea. The species that live here are not present in Britain and vice-versa, however the basic rules still apply.

### How bats produce sound

*Bats echolocate by producing and projecting ultrasonic sounds from their mouths or noses and
then detecting the echoes that return from any solid object within range. Bats produce these
pulses in rapid succession in order to receive a regularly updated picture of their environment.
Thus a single call provides the bat with a single snapshot of its environment whereas a series
of calls provides a series of snapshots, in much the same way as a strobe light provides us
with a series of staggered images.*

*A bat’s echolocation system is highly sophisticated. By emitting short high-frequency pulses
of sound from their mouths or noses, bats are able to use the information contained within the
echoes returned from a solid object to construct a ‘sound picture’ of their environment. Not
only are they able to identify the size, position and speed of objects within three-dimensional
space, they are also able to differentiate forms and surface textures. However, as there is no
single signal form that is optimal for all purposes, bats have evolved a large number of signal
types.*

### Types of bat sounds

`Frequency-modulated broadband signals (FM)`: a broadband signal refers to a signal that spans a wide range of frequencies. Example: An FM echolocation call from a bat sweeping from 20 kHz to 100 kHz is broadband. Useful in cluttered environments like forests, where bats need precise spatial resolution to avoid obstacles.

`qCF signals`: combines the benefits of narrow-band (CF) and broad-band (FM). Generally bat species foraging primarily in a cluttered environment usually put more emphasis on the FM components of their calls while those that forage primarily in an open environment tend to put more emphasis on the qCF
components of their calls. CF calls provide long-range detection.

*`Social calls` produced by bats are often more structurally complex than `echolocation calls`
used for orientation. Social calls are used to communicate with other bats, and for many
species they consist of a wide variety of trills and harmonics, comparable in many respects to
bird song.*

*Some are used to defend patches of insects against other
bats or to sustain territorial boundaries. Others function in attracting a mate or, in the case of
`distress calls`, to initiate a mobbing response. Perhaps the most astounding are the `isolation
calls` emitted by young bats, which allow their mothers to identify them.*

Bats that use FM or FM/qCF calls determine the distance of prey by the time it takes for the
echo to return, while the direction is determined from analysis of the time difference between
the arrival of the echo at the right and the left ears. The echolocation system of `horseshoe bats`
is not based on this time-differential orientation, because the echo would overlap with the
transmitted sound as a result of the long duration of the calls. `Horseshoe bat` calls contain
constant frequency components of very long duration and they have a filter in their ears tuned
precisely to that particular frequency.

Bats also produce sound for communication and this may function in attracting a mate (`advertisement calls`)<sup>2.4.8.1</sup>, defending a feeding area (`patch defence calls`), calling for help (`distress calls`) <sup>2.4.8.2</sup>, or mother–infant communication.

`CF` or `qCF` components contain the highest concentration of energy in the call, known as the
peak frequency or frequency of maximum energy (`FmaxE`).

The speed at which these calls are emitted is known as the pulse
repetition rate and there are differences between species. For example, Natterer’s bat has an
extremely fast pulse repetition rate. In comparison, the repetition rate of the echolocation calls
of noctule is very slow. Some species may have a very regular ‘rhythm’ to this repetition rate
(e.g. Daubenton’s bat) whereas others are erratic (e.g. soprano pipistrelle).

| **This here sounds promising for our design: I could use this approach for the GUI, which can benefit from real-time monitoring, while analysis will be done in a separate process**

Frequency division (FD) is normally the cheapest of the ‘broadband’ systems that
simultaneously monitor the full range of frequencies contained within all bat calls. It uses a
‘zero-crossing’ circuit that produces a square wave output with the same frequency as the
fundamental of the incoming signal. The number of square waves is counted and **for every 10
waves a single square wave of the same total duration is outputted**. This reduces
frequencies by a factor of 10 (sometimes a different factor is used) and brings them within the
audible range but has no effect on time, so calls are heard in real time.

| **And this is what can be useful for analysis**

Along with full spectrum sampling (see below), `time expansion (TE)` gives the most accurate reproduction of bat calls. TE stores the ultrasound signal digitally and replays it at a slower
speed (`usually 10 times, but sometimes slower`) so it can be recorded to a standard audio
device. The signal retains all the characteristics of the original signal, so we hear
the entire call as it should sound except that it is 10 times lower in frequency and 10 times
slower.

| **Another interesting note. We could address that by storing the sounds in a folder in the GUI, but keep real-time monitoring going. Or, preview using FD approach. Either way, the original signal should be preserved.**

The disadvantage of TE is that during the period when the detector plays back the time-expanded sound, it is not capturing any new sounds.


- In general, a bat call will be longer than 2.5 ms and shorter than 70 ms.
- Measuring parameters from the series of three to five selected calls is good practice and
ensures any variation between calls is taken into account; if there are alternating call types,
parameters from both are measured.
- Peak frequency (also referred to as the frequency containing maximum energy (FmaxE)) is
often the key parameter used to identify species, in conjunction with call shape.
- Start or maximum frequency can be very difficult to measure, depending on the level
of background noise and the quality of the recordings
- The time parameters duration and inter-pulse interval are
rarely diagnostic but often measured to help confirm likely species identification.
- Occasionally, calls may be recorded which appear to have repeated or ‘double’ calls. In most cases this appears on a sonogram as distorted sound. These echoes are due to the emitted sound from the bat being picked up directly by the detector but also bouncing off an object such as a wall and the resulting echo also being picked up by the detector.

**The author presents certain call parameters for a number of species <sup>5.1</sup>.  We are only interested in a few, as those are the species that inhabit Vietnam**

#### Greater Horse-Shoe bat
- Inter-pulse interval (ms)90.2 (24.9–186.6)
- Call duration (ms)50.5 (16.3–73.8)
- Frequency of maximum energy (peak) (kHz)81.3 (77.8–83.8)
- Start frequency (kHz)70.2 (62.2–78.5)
- End frequency (kHz)67.3 (58.1–80.9)

- Forages in pasture, parkland, meadows and woodland, especially near water.
- Social calls of the greater horseshoe bat are generally not produced in flight.

#### Lesser Horse-Shoe bat
- Inter-pulse interval (ms)70.4 (14.1–113.7)
- Call duration (ms)43.6 (11.9–61.4)
- Frequency of maximum energy (peak) (kHz)111.1 (107.3–114.0)
- Start frequency (kHz)99.0 (92.3–107.8)
- End frequency (kHz) 96.6 (83.4–110.3)

- Mainly deciduous woodland and wetlands, but also pasture, woodland edge and hedgerows. Also over water and in farmyards.
- Social calls of the lesser horseshoe bat are generally not produced in flight.

#### Daubenton's bat (for training only)
- Inter-pulse interval (ms)75.5 (27.5–186.0)
- Call duration (ms)3.2 (1.4–5.8)
- Frequency of maximum energy (peak) (kHz)47.0 (41.8–56.5)
- Start frequency (kHz)81.1 (50.3–109.7)
- End frequency (kHz)29.4 (22.4–38.6)
- Generally forages higher above the water.
- Social calls, though rarely heard, sound like a loud extra call slipped into the
echolocation call sequence.

#### Common Pipistrelle (for training only)
- Inter-pulse interval (ms)102.5 (59.9–211.0)
- Call duration (ms)5.9 (3.2–8.6)
- Frequency of maximum energy (peak) (kHz)46.6 (43.3–49.9)
- Start frequency (kHz)68.8 (50.8–95.2)
- End frequency (kHz)45.9 (41.2–50.6)

#### Whiskered bat
- Inter-pulse interval (ms)113.0 (66.7–251.5)
- Call duration (ms)4.2 (3.1–6.4)
- Frequency of maximum energy (peak) (kHz)47.5 (39.2–68.5)
- Start frequency (kHz)88.3 (69.9–101.8)
- End frequency (kHz)32.4 (25.6–43.3)
- Woodland, parks, meadows, flowing water, and gardens.

#### Noctule
- Inter-pulse interval (ms)216.9 (120.3–413.1)372.2 (120.2–807.2)
- Call duration (ms)14.7 (8.8–23.4)22.1 (13.2–29.9)
- Frequency of maximum energy (peak) (kHz)24.5 (22.4–33.6)19.3 (17.5–23.6)
- Start frequency (kHz)37.9 (23.8–52.2)23.2 (18.2–30.4)
- End frequency (kHz)23.7 (21.4–32.2)18.3 (17.1–23.0)
- Found in a wide range of open habitats. Common over deciduous woodland, parkland, pasture,
marshland and rivers. Not very common in larger cities.


#### General tips
- Timing: Bats are most active after sunset.
- Location: Look for entrances to caves or areas where bats emerge.
- Keep away from human noise or overlapping natural sounds (e.g., running water).
