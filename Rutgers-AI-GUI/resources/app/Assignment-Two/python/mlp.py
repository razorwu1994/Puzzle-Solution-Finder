# mlp.py
# -------------

# mlp implementation
import util
import math
from random import random
import numpy
PRINT = True

class MLPClassifier:
  """
  mlp classifier
  """
  def __init__( self, legalLabels, max_iterations):
    self.legalLabels = legalLabels
    self.type = "mlp"
    self.max_iterations = max_iterations
    self.network = []
  # Initialize a network
  def initialize_network(self,n_inputs, n_hidden, n_outputs):
    network = list()
    hidden_layer = [{'weights': [0.01/n_hidden*random() for i in range(n_inputs + 1)]} for i in range(n_hidden)]
    network.append(hidden_layer)
    output_layer = [{'weights': [0.01/n_outputs*random() for i in range(n_hidden + 1)]} for i in range(n_outputs)]
    network.append(output_layer)
    return network

  # Calculate neuron activation for an input
  def activate(self,weights, inputs):
    activation = weights[-1]
    for i in range(len(weights) - 1):
      activation += weights[i] * inputs[i]
    return activation

  # Transfer neuron activation
  def transfer(self,activation):
      return activation%len(self.legalLabels)



  # Forward propagate input to a network output
  def forward_propagate(self,network, row):
    inputs = row
    for layer in network:
      new_inputs = []
      for neuron in layer:
        activation = self.activate(neuron['weights'], inputs)
        neuron['output'] = self.transfer(activation/(len(self.legalLabels)))
        new_inputs.append(neuron['output'])
      inputs = new_inputs
    return inputs

  # Calculate the derivative of an neuron output
  def transfer_derivative(self,output):
    return (1-output**2)

  # Backpropagate error and store in neurons
  def backward_propagate_error(self,network, expected):
    for i in reversed(range(len(network))):
      layer = network[i]
      errors = list()
      if i != len(network) - 1:
        for j in range(len(layer)):
          error = 0.0
          for neuron in network[i + 1]:
            error += (neuron['weights'][j] * neuron['delta'])
          errors.append(error)
      else:
        for j in range(len(layer)):
          neuron = layer[j]
          errors.append(expected[j] - neuron['output'])
      for j in range(len(layer)):
        neuron = layer[j]
        neuron['delta'] = errors[j] * self.transfer_derivative(neuron['output'])


      # Update network weights with error
  def update_weights(self,network, row, l_rate):
    for i in range(len(network)):
      inputs = row[:-1]
      if i != 0:
        inputs = [neuron['output'] for neuron in network[i - 1]]
      for neuron in network[i]:
        for j in range(len(inputs)):
          neuron['weights'][j] += l_rate * neuron['delta'] * inputs[j]
        neuron['weights'][-1] += l_rate * neuron['delta']
  # Train a network for a fixed number of epochs
  def train_network(self,network, train, l_rate, n_outputs):
      sum_error = 0
      outputs = self.forward_propagate(network, train)
      expected = [0 for i in range(n_outputs)]
      try:
        expected[train[-1]] = 1
      except:
        expected[n_outputs-1]=1
      sum_error += sum([(expected[i] - outputs[i]) ** 2 for i in range(len(expected))])
      self.backward_propagate_error(network, expected)
      self.update_weights(network, train, l_rate)




  def train( self, trainingData, trainingLabels, validationData, validationLabels ):
    n_inputs = len(trainingData[0])
    n_outputs = len(self.legalLabels)
    self.network = self.initialize_network(n_inputs, 50, n_outputs)
    for iteration in range(self.max_iterations):
      print "Starting iteration ", iteration, "..."
      for i in range(len(trainingData)):
        # Test training backprop algorithm
        trainingCluster=list()
        trainingCluster.extend(trainingData[i])
        trueLabel = trainingLabels[i]
        trainingCluster.append(trueLabel)
        self.train_network(self.network, trainingCluster, 0.5, n_outputs)

      for i in range(len(validationData)):
        trainingCluster = list()
        trainingCluster.extend(validationData[i])
        trueLabel = validationLabels[i]
        trainingCluster.append(trueLabel)
        self.train_network(self.network, trainingCluster, 0.5, n_outputs)

  # Make a prediction with a network
  def predict(self,network, row):
    outputs = self.forward_propagate(network, row)
    return outputs.index(max(outputs))

  def classify(self, data ):
    guesses = []
    for datum in data:
      # fill predictions in the guesses list
      "*** YOUR CODE HERE ***"
      trainingCluster = list()
      trainingCluster.extend(datum)
      guessLabel = math.floor(random()*len(self.legalLabels))
      trainingCluster.append(guessLabel)
      prediction = self.predict(self.network, trainingCluster)
      guesses.append(prediction)

    return guesses