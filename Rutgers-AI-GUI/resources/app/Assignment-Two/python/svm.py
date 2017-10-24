# svm.py
# -------------

# svm implementation
import util
import numpy as np
from sklearn.svm import LinearSVC
PRINT = True

class SVMClassifier:
  """
  svm classifier
  """
  def __init__( self, legalLabels):
    self.legalLabels = legalLabels
    self.type = "svm"
    self.clf = LinearSVC(multi_class='ovr')
      
  def train( self, trainingData, trainingLabels, validationData, validationLabels ):
    # print "Starting iteration ", iteration, "..."
    print "Starting iteration ..."
    tData = [] # List of trainingData values
    
    for i in range(len(trainingData)):
        "*** YOUR CODE HERE ***"
        tData.append(trainingData[i]) # Get values only
        
    x = np.array(tData) # Input 2D array i from trainingData
    y = np.array(trainingLabels) # True label for input i
    
    self.clf.fit(x, y)
    
  def classify(self, data ):
    guesses = []
    i = 0
    for datum in data:
      i = i + 1
      # fill predictions in the guesses list
      "*** YOUR CODE HERE ***"
      #----------------------------------------------------------
      tempArr = np.array([datum]) # Need 2D np.array for some reason
      guess = self.clf.predict(tempArr) # predicted class label per sample
      guesses.append(guess) # Only on same so append first value
      #----------------------------------------------------------

    return guesses

