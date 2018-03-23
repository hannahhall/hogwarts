(function FunWithMachineLearning () {
  const net = new brain.NeuralNetwork();
  let questions = [], answersKey = [], input = { a: 0, b: 0, c: 0, d: 0 };

  net.train([
    { input: { a: 4, b: 0, c: 0, d: 0 }, output: { Gryffindor: 1 } },
    { input: { a: 0, b: 4, c: 0, d: 0 }, output: { Slytherin: 1 } },
    { input: { a: 0, b: 0, c: 4, d: 0 }, output: { Hufflepuff: 1 } },
    { input: { a: 0, b: 0, c: 0, d: 4 }, output: { Ravenclaw: 1 } },
  ]);

  let questionEl = (question) => {
    return `<p>${question.question}</p>`
  };

  let answersEl = (res) => {
    let key = ['a', 'b', 'c', 'd'];
    let answersEl = res.map((answer, index) => {
      return `<div>
        <input type="radio" class="answers" name="${answer.questionId}" value="${key[index]}" />
        ${answer.answer}
      </div>`;
    });
    return answersEl.join('');
  };

  let analyze = (input) => {
    let output = net.run(input);
    let analyzeEl = '';
    for (let data in output) {
      let percent = output[data].toFixed(2) * 100;
      analyzeEl += `<div>
        <span>${data}: ${percent}%</span>
        <div class="bar" style="width: ${percent}%">&nbsp</div>
      </div>`;
    }
    $('#analyze').html(analyzeEl);
  }


  $.when(
    $.get('../questions.json', (res) => {
      questions = res;
    }),
    $.get('../answers.json', (res) => {
      answersKey = res;
    })
  ).then(() => {
    let form = '';
    questions.forEach(question => {
      form += `<div class="question">` + questionEl(question);
      let answerSet = answersKey.filter((answer) => {
        return answer.questionId == question.id;
      });
      form += answersEl(answerSet) + "</div>";
    });
    form += `<div class="button-container"><button type="button" id="submit">Accio House</button></div>`
    $('#questions').append(form);
  });

  $('#questions').click((event) => {
    if (event.target.id == 'submit') {
      $('.answers').filter(':checked').each((index, answer) => {
        input[answer.value] += 1;
      });
      analyze(input);   
    }
  });
})();
