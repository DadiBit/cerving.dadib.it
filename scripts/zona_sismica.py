#!/bin/env python3

import csv
import json
import sys
import os

if len(sys.argv) != 2:
    print("Usage: python zona_sismica.py <CSV>")
    sys.exit(1)

with open(sys.argv[1], mode='r', newline='', encoding='utf-8') as f:
    reader = csv.reader(f, delimiter=";")
    next(reader) # skip header
    data = list(reader)

with open("./frontend/public/db/zona_sismica.json", mode='w', encoding='utf-8') as f:
    json.dump(data, f, separators=(',', ':'))
