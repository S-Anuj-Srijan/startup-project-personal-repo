# deployworkflow.py

import sys
import json
from datetime import datetime

def main():
    print("=== Deploy Workflow Test ===")

    if len(sys.argv) > 1:
        try:
            workflow_json = sys.argv[1]
            data = json.loads(workflow_json)
            print("Workflow received:")
            print(json.dumps(data, indent=2))
        except Exception as e:
            print("Failed to parse workflow JSON:", e)
    else:
        print("No workflow data provided.")

    print("Deployment time:", datetime.now().isoformat())
    print("Status: SUCCESS")

if __name__ == "__main__":
    main()
