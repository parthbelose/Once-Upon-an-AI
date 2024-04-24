import google.generativeai as genai
import os
from dotenv import load_dotenv
from flask import Flask, jsonify, request
import re
import codecs

load_dotenv()

google_api_key = os.environ.get('GOOGLE_API_KEY')
genai.configure(api_key=google_api_key)
model = genai.GenerativeModel('gemini-pro')

outline_prompt="""
You are a famous children's book author known for your engaging and educational stories.

**Here's the challenge:**

* **Title:** {title}
* **Description:** {description}

**Your Task:**

Craft a captivating children't book outline, structured by page number and content. Each page should be brief but capture key story elements and leave the reader wanting more. Remember to inject your signature humor and educational elements wherever possible!

**Output Format:**

I want each page in a paragraph. Seperate pages using new lines and no other new lines whatsoever.
"""
def finalOutline(title,description):
  outline=[""]
  ans=None
  while not ans:
    try:
      response = model.generate_content(outline_prompt.format(title=title,description=description))
      ans=response.candidates[0].content.parts[0]
      temp=str(ans)[7:].split("\\n\\n")
    except:
      print("error")
  outline.extend(temp)
  outline.append("")
  return outline

story_prompt="""
You are a famous children's book author.
You write educational and funny children's book.
You will be given a short description of a page and based on that you are to write the complete page.
Make your story more readable. to add context you are given description of previous and next page. However you are only supposed to write about the current page.
Remember to inject your signature humor and educational elements wherever possible!
Only generate the page content and nothing else.
You are only supposed to generate content based on current page data.
Ensure smooth transition from the previous page.
Previous Page:
{previous_page}

Current Page description:
{current_page}

Next Page description :
{next_page}

"""

def generate_page_content(previous_page,current_page,next_page):
  text=None
  while not text:
    try:
      response = model.generate_content(story_prompt.format(previous_page=previous_page,current_page=current_page,next_page=next_page))
      text=str(response.candidates[0].content.parts[0])
    except:
      print("Error")
  return text

def write_book(title="",description=""):
  content=[""]
  outline=finalOutline(title,description)
  for i in range(1,len(outline)-1):
    text=generate_page_content(previous_page=content[-1],current_page=outline[i],next_page=outline[i+1])
    content.append(text[7:])
  content.pop()
  return content

def finalBook(content):
  text=""
  for i in content:
    text+=i+'\n'
  return text   

# title=input("Enter title:")
# description=input("Enter description:")
# print("\n\nGenerating Book...")
# content=generate_book(title,description)
# book=finalBook(content)
# print(book)

ESCAPE_SEQUENCE_RE = re.compile(r'''
    ( \\U........      # 8-digit hex escapes
    | \\u....          # 4-digit hex escapes
    | \\x..            # 2-digit hex escapes
    | \\[0-7]{1,3}     # Octal escapes
    | \\N\{[^}]+\}     # Unicode characters by name
    | \\[\\'"abfnrtv]  # Single-character escapes
    )''', re.UNICODE | re.VERBOSE)

def decode_escapes(s):
    def decode_match(match):
        return codecs.decode(match.group(0), 'unicode-escape')

    return ESCAPE_SEQUENCE_RE.sub(decode_match, s)

# text_with_escape_sequences = "This is a string with\n\tescape sequences like \'quotes\'."
# text_without_escape_sequences = remove_escape_sequences(text_with_escape_sequences)
# print(text_without_escape_sequences)  

app = Flask(__name__)

@app.route('/generate_book', methods=['POST'])
def generate_book():
  if request.method == 'POST':
    print(request.json)
    data = request.get_json()
    title = str(data['title'])
    description = str(data['description'])
    print("\n\nGenerating Book...") 
    print(title,description)
    content=write_book(title,description)
    book=finalBook(content)
    book=decode_escapes(book)
    return jsonify({'title': title, 'description': description, 'story': book})
  else:
    return jsonify({'error': 'Invalid request method. Please use POST.'})

if __name__ == '__main__':
  app.run(port=3000,debug=True)
