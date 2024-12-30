# Choosing the ML model

### Logistic Regression or DL?

DL normally requires a very large dataset of hundreds of thousands of samples. It may not be necessary for my cause.

Although I could automate sample generation from live recordings, I am not sure how long it will take me to collect all that raw audio. Simpler models like Softmax Regression may work for me.

### Preliminary notes & ideas

From my research, I found two promising candidates for the neural network design:

- `Softmax Regression`
- `Convolutional Neural Network`

I am just sketching ideas right now, but here are the reasons why either of them is a promising option.

### Convolutional Neural Networks
The main advantage of this model is that it seems to work nicely with images - and if I opt to use spectrograms/sonograms (like Mel) as an input, that is a plus. 

Another benefit of using `CNN` is of they way the layers work together, where each neuron in a layer only sees a portion of the input vector, and each consecutive neuron sees its own portion plus part of the portion that the previous neuron processed. 

I imagine it as the model windowing the input with overlaps as it processes it. That again can be a plus working with real-time audio, but I currently cannot explain why exactly.

### Softmax Regression

This seems to be based on the `Logistic Regression` algorithm that I am already familiar with. In short, `Logistic Regression` is a common `binary classification algorithm` that produces 1 of 2 possible outputs (thus the name binary), like:

- a cat or a dog
- 1 or 0
- yes or no

`Logistic Regression` is relatively straightforward.

First, we need to calculate a probability of something. Then, we need to compute the loss and the cost of that prediction. The cost of a prediction is basically a numeric value that indicates how far a certain prediction is from the truth.

The cost function $J$ for logistic regression can be formulated as follows:

$$
J(\vec{w}, b) = \frac{1}{m} \sum_{i=1}^m L_i
$$amount

Where $m$ is the number of features, and $L$ is the log loss.

$$
L =
\left\{
\begin{array}{ll}
-log(z) & \text{if } y = 1 \\
-log(1-z) & \text{if } y = 0 \\
\end{array}
\right.
$$

Where $z$ is the value of the `sigmoid function` described below.


Finally, we apply gradient descent to minimise the cost and find the best $\vec{w}$ and $b$ for the model. 

We repeat the process for a specific number of iterations called `epoch` with a learning rate $\alpha$. The learning rate is what is sounds like it is. Choosing a good $\alpha$ is critical. A learning rate too high may lead to innacurate results, and a learning rate too small will make learning too slow.

To calculate a probability, we first do the same we do in linear regression. Given a feature vector $\vec{x}$ and weights $\vec{w}$, $b$, we compute the prediction.

$$
f(\vec{x}) = \vec{w}\vec{x} + b
$$

We store the result as $z$. However, that is not enough for logistic regression. Since this algorithm is a binary classification algorithm, our prediction needs to be in the range from 0 to 1. This is where the `sigmoid function` comes into play.

$$

$$
$$
g(z) = \frac{1}{1 + e^{-z}}
$$

That will result in a floating point number between 0 and 1, where 0 is the least likelihood and 1 is the highest.

`Softmax Regression` extends this algorithm and allows for multi-class classification. In essence, for 10 possible outcomes represented as scalar 1, each will have a fraction of 1. The one with the highest fraction is the guess of the highest confidence.

To illustrate, imagine a model that takes an image and tries to classify if the image is either

- a human
- a dog
- a cat
- a car

That is 4 possible outcomes.

The general formula for `Softmax Regression`:

$$
z_j = \vec{w}_j\vec{x} + b_j
$$

$$
a_j = \frac {e^{z_j}}{\sum_{k=1}^N e^{z_k}} = \frac{e^{z_j}}{e^{z_1} + e^{z_2} ... + e^{z_N}}
$$

Where $N$ is the number of features.

The model takes an input feature
$\vec{x}$, computes an output vector $\vec{a^1}$, passes that to a hidden layer, then to another one, and the final, `softmax` layer produces a vector $\vec{a}$ that contains the fractions.

$$ 
\mathbf{a} = \begin{bmatrix} 0.5 & 0.2 & 0.2 & 0.1 \end{bmatrix}
$$

$$ \sum_{i=1}^4 a_i = a_1 + a_2 + a_3 + a_4 = 1
$$

Thus, if $a_1$ corresponds to a human, the model predicts the image is that of a human with a chance of $0.5$

A model with 4 possible outputs in its Softmax layer will have 4 weights $\vec{w}$ and 4 biases $b$. As the $\vec{x}$ arrives at the softmax layer, computations for each $a_j$ are performed to estimate the probability, as shown above.

Finally, for each $a_j$ we perform:

$$
L(a_1, a_2, ... a_N) =
\left\{
\begin{array}{ll}
-log_{a_1} & \text{if } y = 1 \\
-log_{a_2} & \text{if } y = 2 \\
... \\
-log_{a_N} & \text{if } y = N 
\end{array}
\right.
$$

### Summary
There are currently two candidates, each has their own advantages. Experimentation is required to find the best one.


### Extra

#### Tips
- Adding polynomials can help make the model more accurate

#### Terminology
- `training set` - used to train the model

- `cross validation set` (also called validation, development, or dev set) - used to evaluate the different model configurations you are choosing from. For example, you can use this to make a decision on what polynomial features to add to your dataset
caffeine
- `test set` - used to give a fair estimate of your chosen model's performance against new examples. This should not be used to make decisions while you are still developing the models.
- `regularization` - lambda ($\lambda$) is a hyperparameter used to control the complexity of the model and reduce overfitting. Regularization adds a penalty to the loss function. 
The standard loss function (e.g., mean squared error for regression) is modified to include a term that penalizes large model weights or coefficients.
$\lambda$ controls the strength of this penalty: By adjusting the value of $\lambda$, you control how much importance the model places on keeping the weights small relative to minimizing the loss.


#### Formulas
- Mean Squared Error of a Training Set

$$J_{train}(\vec{w}, b) = \frac{1}{2m_{train}}\left[\sum_{i=1}^{m_{train}}(f_{\vec{w},b}(\vec{x}_{train}^{(i)}) - y_{train}^{(i)})^2\right]$$