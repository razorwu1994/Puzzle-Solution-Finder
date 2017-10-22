# perceptron.py
# -------------

# Perceptron implementation
import util
PRINT = True

class PerceptronClassifier:
  """
  Perceptron classifier.
  
  Note that the variable 'datum' in this code refers to a counter of features
  (not to a raw samples.Datum).
  """
  def __init__( self, legalLabels, max_iterations):
    self.legalLabels = legalLabels
    self.type = "perceptron"
    self.max_iterations = max_iterations
    self.weights = {}
    for label in legalLabels:
      self.weights[label] = util.Counter() # this is the data-structure you should use

  def setWeights(self, weights):
    assert len(weights) == len(self.legalLabels.size);
    self.weights == weights;
      
  def train( self, trainingData, trainingLabels, validationData, validationLabels ):
    """
    The training loop for the perceptron passes through the training data several
    times and updates the weight vector for each label based on classification errors.
    See the project description for details. 
    
    Use the provided self.weights[label] data structure so that 
    the classify method works correctly. Also, recall that a
    datum is a counter from features to values for those features
    (and thus represents a vector a values).
    """
    
    # self.features = trainingData[0].keys() # could be useful later
    # DO NOT ZERO OUT YOUR WEIGHTS BEFORE STARTING TRAINING
    print (len(trainingData))
    #
    for iteration in range(self.max_iterations):
      print "Starting iteration ", iteration, "..."
      for i in range(len(trainingData)):
        "*** YOUR CODE HERE ***"
        #----------------------------------------------------------------------------------------------------------------
        " Find the assigned label of training data i "
        alpha = 0.01 # Learning rate
        
        xKeys = range(len(trainingData[i]))
        x = trainingData[i] # Input vector of trainingData[i]
        xCounter = util.Counter()
        for j in range(len(xKeys)):
          xCounter[xKeys[j]] = x[j]
        
        scores = util.Counter()

        for j in range(len(self.legalLabels)):
          scores[j] = xCounter * self.weights[j]

        # print "{}) scores[1] = {}".format(i, scores[1)
        assignedLabel = scores.argMax()
        # print "({}, {})".format(i, assignedLabel)

        " Find the error "
        trueLabel = trainingLabels[i]
        labelDiff = trueLabel - assignedLabel

        " If no error, label is correct, go to next data point "
        if labelDiff == 0:
          continue;

        " Otherwise, update weights using perceptron learning rule w_i' <- w_i + a * (y - h(x)) * x_i "
        " Need to update both the true label's weights y and the assigned label's weights y' "
        xCounter.divideAll((1.0/alpha)) # multiply input with alpha
        self.weights[assignedLabel] = self.weights[assignedLabel] -  xCounter # assigned label was incorrect, so decrease weights
        self.weights[trueLabel] = self.weights[trueLabel] + xCounter # true label's was not picked, so increase weight based on true example x
        #-----------------------------------------------------------------------------------------------------------------
        
  def classify(self, data ):
    """
    Classifies each datum as the label that most closely matches the prototype vector
    for that label.  See the project description for details.
    
    Recall that a datum is a util.counter... 
    """
    guesses = []
    for datum in data:
      vectors = util.Counter()
      for l in self.legalLabels:
        vectors[l] = self.weights[l] * datum
      guesses.append(vectors.argMax())
    return guesses

  
  def findHighWeightFeatures(self, label):
    """
    Returns a list of the 100 features with the greatest weight for some label
    """
    featuresWeights = []

    "*** YOUR CODE HERE ***"
    #-----------------------------------------------------------------------------------------------------------------
    sortedKeys = self.weights[label].sortedKeys()
    # temp print "sortedKeys[:100]: {}\n\n\n".format(sortedKeys[:100])
    featuresWeights = sortedKeys[:100] # Get the top 100 keys
    # temp print "featuresWeights = {}".format(featuresWeights) 
    #-----------------------------------------------------------------------------------------------------------------

    return featuresWeights

