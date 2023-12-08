import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
from mpl_toolkits.mplot3d import Axes3D

# Generate the data (replicating the data generation process)
np.random.seed(0)
heights = np.random.uniform(1, 100, 100)
widths = np.random.uniform(1, 100, 100)
depths = np.random.uniform(1, 100, 100)
volumes = heights * widths * depths
errors = np.random.normal(0, volumes * 0.1, 100)
values = volumes + errors

# Create a DataFrame
data = pd.DataFrame({'Height': heights, 'Width': widths, 'Depth': depths, 'Value': values})

# Create a 3D scatter plot
fig = plt.figure(figsize=(10, 8))
ax = fig.add_subplot(111, projection='3d')

# Plotting
sc = ax.scatter(data['Height'], data['Width'], data['Depth'], c=data['Value'], cmap='viridis')

# Adding labels and title
ax.set_xlabel('Height')
ax.set_ylabel('Width')
ax.set_zlabel('Depth')
plt.title('3D Scatter Plot of Data Points')

# Adding a color bar to represent the 'Value'
plt.colorbar(sc, label='Value')

# Show plot
plt.show()
