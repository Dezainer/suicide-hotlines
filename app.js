const Crawler = require('crawler')

const getNumbers = () => (
  new Promise((resolve, reject) => {
    const c = new Crawler({
      maxConnections: 10,
      callback: (err, res, done) => {
        if(err) {
          reject(err)
          return
        }

        const { $ } = res
        const rawNumbers = Array.from($('.numbers'))
        const numberList = rawNumbers[0].children[0].children

        console.log(numberList)

        const result = numberList
          .filter((_, i) => i > 0)
          .map(number => ({
            country: number.children[2].children[0].data.trim().replace(':', ''),
            numbers: {
              emergency: number.children[4].children[0] && number.children[4].children[0].data,
              suicideHotline: (number.children[6] &&
                number.children[6].children[0].data.replace(/\D+/g, '')
              ) || undefined,
            }
          }))

        resolve(result)
        done()
      }
    })

    c.queue('https://www.opencounseling.com/suicide-hotlines')
  })
)

getNumbers().then(numbers => console.log(numbers))