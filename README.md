# create virtual environment
cd path/to/your/project
py -3.12 -m venv venv312

# run virtual environment
.\venv312\Scripts\Activate.ps1
deactivate

# install packages
pip install --upgrade pip
pip install matplotlib
pip install jupyter
pip install pandas numpy scikit-learn lightgbm tensorflow joblib
 
# run jupyter
jupyter notebook
python -m notebook
