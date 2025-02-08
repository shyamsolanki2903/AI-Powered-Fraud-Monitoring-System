Frontend :-     1️⃣ Node Modules Install Karna (agar package.json hai)
                cd frontend
                npm install
                Yeh command package.json file ke andar jo bhi dependencies hain, unko install kar degi.
                
                2️⃣ Agar package.json nahi hai aur naya setup karna hai
                cd frontend
                npm init -y
                npm install react react-dom
                Agar tum React project setup kar rahe ho toh react aur react-dom install kar sakte ho.
                
                3️⃣ Agar sirf node_modules delete karke wapas install karna hai
                rm -rf node_modules package-lock.json
                npm install


Backend :- Step 1: Virtual Environment Create Karna
          Terminal ya Command Prompt open karein aur project directory mein jaake yeh command run karein:
          python -m venv env
          ⚡ Yeh command ek env folder create karegi jo virtual environment hoga.
          
          Step 2: Virtual Environment Activate Karna
          Windows:
          env\Scripts\activate
          Mac/Linux:
          source env/bin/activate
          ✅ Agar activation successful ho gaya, toh terminal mein (env) prefix dikhai dega.
          
          Step 3: Dependencies Install Karna (Agar Required Ho)
          Agar aapke project mein requirements.txt file hai, toh sab dependencies install karne ke liye yeh command run karein:
          pip install -r requirements.txt
