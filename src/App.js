import React, { Component } from "react";

class App extends Component {
  //state is being used to generate invisible background divs to highlight line
  state = {
    lines: []
  };

  codeIsBalanced = text => {
    //array separated by line breaks
    let codeByLine = text.split(/\n/);
    //set state to update line-container div
    this.setState({ lines: codeByLine });

    //memory of specific open symbols
    let parenthesis = [];
    let squareBracket = [];
    let curlyBrace = [];

    //memeory of all symbols
    let mostRecent = [];

    //error for mismatched closing symbol
    let errorText;
    let lineOfError;
    let expecting = {
      "(": ")",
      "[": "]",
      "{": "}"
    };

    codeByLine.forEach((line, index) => {
      //stop running through the text on mismatched symbol
      if (errorText !== undefined) return;

      for (let i = 0; i < line.length; i++) {
        if (errorText !== undefined) return;

        let char = line[i];

        //functions for pushing and popping symbol arrays, or setting error text on mismatch
        //ESLint doesn't like functions inside for loop however it is only a problem when using var
        function openChar(array) {
          array.push(`line ${index}, ${i}`);
          mostRecent.push(char);
        }

        function closeChar(array) {
          let lastChar = mostRecent[mostRecent.length - 1];
          let length = array.length;
          if (char !== expecting[lastChar]) {
            errorText = `Error: was expecting ${
              expecting[lastChar]
            } and instead got ${char} at line ${index}, ${i}`;
            lineOfError = index;
          } else if (length > 0) {
            array.pop();
            mostRecent.pop();
          }
        }
        //run the functions if enclosure characters are encountered
        switch (char) {
          case "(":
            openChar(parenthesis);
            break;
          case ")":
            closeChar(parenthesis);
            break;
          case "[":
            openChar(squareBracket);
            break;
          case "]":
            closeChar(squareBracket);
            break;
          case "{":
            openChar(curlyBrace);
            break;
          case "}":
            closeChar(curlyBrace);
            break;
          default:
            break;
        }
      }
    });

    let errContainer = document.getElementById("error-container");

    //remove any red highlights in textarea
    document
      .querySelectorAll(".line")
      .forEach(line => (line.style.backgroundColor = "white"));

    //blank textarea
    if (text.length === 0) {
      errContainer.style.background = "white";
      errContainer.innerHTML = "There is no code to test.";
      return;
    }
    //success message
    if (
      parenthesis.length === 0 &&
      squareBracket.length === 0 &&
      curlyBrace.length === 0 &&
      errorText === undefined
    ) {
      errContainer.style.background = "rgba(80,205,0,0.5)";
      errContainer.innerHTML = "Your code is balanced.";
    } else {
      //fail message
      errContainer.style.background = "rgba(255, 0, 0, 0.7)";

      //print the mismatch if there is one and return
      if (errorText) {
        errContainer.innerHTML = errorText;

        //highlight the line red in the textarea
        document.getElementById("line-" + lineOfError).style.backgroundColor =
          "rgba(255, 0, 0, 0.3)";
        return;
      }

      //list unclosed symbols if there is not a mismatch
      errContainer.innerHTML = `You have open enclosures:<br />`;
      if (parenthesis.length !== 0)
        errContainer.innerHTML += `Parenthesis: ${parenthesis.join(
          " // "
        )}<br />`;
      if (squareBracket.length !== 0)
        errContainer.innerHTML += ` Square Brackets: ${squareBracket.join(
          " // "
        )} <br />`;
      if (curlyBrace.length !== 0)
        errContainer.innerHTML += ` Curly Braces: ${curlyBrace.join(" // ")}`;

      //highlight lines with open symbols red
      let errSplit = errContainer.innerHTML
        .split(",")
        .filter(x => x.includes("line"));
      errSplit.forEach(x => {
        let xSplit = x.split(" ");
        let lineNum = xSplit[xSplit.length - 1];
        document.getElementById("line-" + lineNum).style.backgroundColor =
          "rgba(255, 0, 0, 0.3)";
      });
    }
  };

  // the lines-container is behind the textarea for red highlighting of specific line.
  // I use <pre> to retain the white space of text (which is transparent) so it wraps correctly.
  render() {
    return (
      <div className="App">
        <textarea
          id="my-textarea"
          placeholder="Input Code Here"
          name="my-textarea"
          onInput={e => this.codeIsBalanced(e.target.value)}
        />
        <div id="error-container">There is no code to test.</div>
        <div id="lines-container">
          {this.state.lines.map((line, index) => {
            return (
              <pre key={index} className="line" id={"line-" + index}>
                {line + " "}
              </pre>
            );
          })}
        </div>
        <div className="explanation">
          <h4>Fractal Coding Challenge, by Michael Wilson</h4>
          <p>
            My solution not only finds and highlights mismatching enclosures,
            but also all of the currently unclosed symbols.
            <br />
            <a href="mailto:maarondesigns@gmail.com">maarondesigns@gmail.com</a>
          </p>
        </div>
      </div>
    );
  }
}

export default App;
