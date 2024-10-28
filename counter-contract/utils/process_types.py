import caer 
import os 
import shutil as sh 
import re

TYPES_DIR = os.path.abspath("./types/")
APP_TYPES_DIR = os.path.abspath("../web/src/types/")

files = caer.path.listdir(TYPES_DIR, recursive=False, use_fullpath=True, ext=(".ts"), verbose=False)

for file in files:
    file_name = file.split("/")[-1]
    if file_name.endswith(("d.ts", "Factory.ts", "index.ts")):
        continue
    file_name = file_name.replace(".ts", "")
    # print("filename", file_name)

    found_match = False
    has_added_type = False

    has_added_connect_as_prev = False
    has_added_type_import_prev = False

    # Check whether "connect" and "as" have already been added to the class fragment
    with open(file, "r") as f:
        for line in f:
            if re.search("connect(account: Provider | Account):", line) or re.search("as(account: Provider | Account):", line):
                has_added_connect_as_prev = True
                continue
            elif re.search("import type { Account, Provider } from 'fuels';", line):
                has_added_type_import_prev = True
                continue

    new_content = []
    with open(file, "r") as f:
        for line in f:
            if re.search(r"^export class (\w+) extends Contract", line):
                found_match = True

                new_content.append(line)

                if not has_added_connect_as_prev:
                    # Add the new line after the match
                    new_content.append(f"  connect: (account: Provider | Account) => {file_name};\n")
                    new_content.append(f"  as: (account: Provider | Account) => {file_name};\n")
            elif re.search("^} from 'fuels';", line):
                new_content.append(line)
                if not (has_added_type or has_added_type_import_prev):
                    has_added_type = True
                    new_content.append("\nimport type { Account, Provider } from 'fuels';\n")
            else:
                new_content.append(line)
    
    # Write the new content to the file
    with open(file, "w") as f:
        f.writelines(new_content)

    if not found_match:
        print(f"Could not find match in {file_name}")

if os.path.exists(APP_TYPES_DIR):
    sh.rmtree(APP_TYPES_DIR)
    
sh.copytree(
    TYPES_DIR,
    APP_TYPES_DIR
)

print(">>> Done generating types")