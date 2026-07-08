async function test() {
  try {
    const res = await fetch("http://localhost:5000/api/courses/1/modules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        modules: [
          {
            moduleName: "Test Module",
            videos: [
              {
                videoTitle: "Test Video",
                videoUrl: "https://www.youtube.com/watch?v=M7lc1UVf-VE",
                questions: [
                  {
                    question: "Test Q",
                    optionA: "A",
                    optionB: "B",
                    optionC: "C",
                    optionD: "D",
                    correctAnswer: "A",
                  }
                ]
              }
            ]
          }
        ]
      })
    });
    const text = await res.text();
    console.log(res.status, text);
  } catch (err) {
    console.error(err.message);
  }
}
test();
