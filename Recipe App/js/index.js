function removeElement(element) {
  document.querySelectorAll(element).forEach(e => e.parentNode.removeChild(e));
}

function addClass(el, newClass) {
  const element = document.querySelectorAll(el);

  element.forEach(d => {
    d.classList.add(newClass)
  })
}

function removeClass(el, newClass) {
  const element = document.querySelectorAll(el);

  element.forEach(d => {
    d.classList.remove(newClass)
  })
}

function addLoading() {
  const body = document.querySelector(".o-home__container");
  const img = document.createElement("img");

  body.append(img)
  img.setAttribute("src", "./assets/images/loading.gif")
  img.setAttribute("class", "loading-gif")
  img.setAttribute("id", "loading-gif-id")
}

async function handleError(code) {
  let textErr = ""
  switch (code) {
    case 403:
      textErr = "Forbidden"
      break;
    case 404:
      textErr = "Data not found"
      break;
    default:
      textErr = "Something went wrong"
      code = 500
  }
  addOverlay(code, textErr)
}

async function addOverlay(code, textErr) {
  const body = document.querySelector("body");
  const div = document.createElement("div");
  const content = document.createElement("div")
  const img = document.createElement("img")
  const h1 = document.createElement("h1")

  body.append(div);
  div.append(content);
  content.append(img)
  content.append(h1)

  div.setAttribute("class", "o-overlay")
  document.querySelector(".o-overlay").addEventListener("click", e => {
    removeElement(".o-overlay")
  })

  content.setAttribute("class", "o-overlay__content")
  img.setAttribute("class", "o-overlay__forbidden")
  img.setAttribute("src", "./assets/images/forbidden.png")
  h1.setAttribute("class", "o-overlay__text-error")

  h1.innerHTML = code + " - " + textErr 
}

function recipeCard({ recipe, recipeImg }) {
  return `<div class="o-home__recipe-card">
    <h1 class="o-home__recipe-card-attr o-home__recipe-card-attr_title">${recipe.title}</h1>
    <img src="${recipeImg}" class="o-home__recipe-card-attr o-home__recipe-card-attr_img"/>
    <h3 class="o-home__recipe-card-attr o-home__recipe-card-attr_content">${recipe.ingredients}</h3>
    <a href="${recipe.href}" target="_blank" class="o-home__recipe-card-attr o-home__recipe-card-attr_button">VIEW RECIPES</a>
  </div>`
}

async function fetchData(page = 1, ing = null, query = null) {
  if(page == 1) {
    document.querySelector("#pagination-back").disabled = true
  } else {
    document.querySelector("#pagination-back").disabled = false
  }

  const resp =
    await axios.get("https://recipe-puppy.p.rapidapi.com/", {
      params: {
        p: page,
        i: ing ? ing.split(" ").join(",") : null,
        q: query
      },
      headers: {
        "x-rapidapi-key": "b270c452fbmshe9212505f298731p11d253jsndcf86253c77b",
        "x-rapidapi-host": "recipe-puppy.p.rapidapi.com",
        "useQueryString": true
      }
    })
  return resp.data
}

async function init() {
  let page = 1
  let ingredients = ""
  let recipe = ""

  let loading = false

  let data = []

  let statScreen = 'big'

  const home = document.querySelector(".o-home__container-data")

  const resizeCallback = (e) => {
    if(e.innerWidth < 376) {
      statScreen = 'small'
    } else if(e.innerWidth < 1024) {
      statScreen = 'medium'
    } else {
      statScreen = 'big'
    }

    if(statScreen == 'small' || statScreen == 'medium') {
      addClass(".o-home__recipe-card", "o-home__recipe-card_mobile")
      addClass(".o-home__recipe-card-attr_title", "o-home__recipe-card-attr_title_mobile")
      addClass(".o-home__recipe-card-attr_img", "o-home__recipe-card-attr_img_mobile")
      addClass(".o-home__recipe-card-attr_content", "o-home__recipe-card-attr_content_mobile")
    } else {
      removeClass(".o-home__recipe-card", "o-home__recipe-card_mobile")
      removeClass(".o-home__recipe-card-attr_title", "o-home__recipe-card-attr_title_mobile")
      removeClass(".o-home__recipe-card-attr_img", "o-home__recipe-card-attr_img_mobile")
      removeClass(".o-home__recipe-card-attr_content", "o-home__recipe-card-attr_content_mobile")
    }
  }

  window.addEventListener("resize", e => {
    resizeCallback(e.target)
  })

  function render() {
    if(loading) {
      home.innerHTML = ""
      addLoading()
    } else {
      removeElement(".loading-gif")
      const strData = data.map((d) => {
        let recipeImg = "./assets/images/no-image.jpg"
        if (d.thumbnail) {
          recipeImg = d.thumbnail
        }
        return recipeCard({recipe: d, recipeImg})
      }).join("\n")

      home.innerHTML = strData
      resizeCallback(window)

      document.querySelector("#pagination-index-text").innerHTML = page
    }
  }
  
  const loadRender = () => {
    loading = true
    render()

    fetchData(page, ingredients, recipe)
      .then((d) => {
        data = d.results
        loading = false
        render()
      })
  }

  const buttonBack = document.querySelector("#pagination-back")
  const buttonNext = document.querySelector("#pagination-next")
  const buttonSubmit = document.querySelector("#submit-search-btn")
  const ingredientsInput = document.querySelector('#ingredients-input')
  const recipeInput = document.querySelector('#recipe-input')

  buttonBack.addEventListener("click", e => {
    page--
    loadRender()
  })

  buttonNext.addEventListener("click", e => {
    page++
    loadRender()
  })

  buttonSubmit.addEventListener("click", e => {
    ingredients = ingredientsInput.value
    recipe = recipeInput.value
    loadRender()
  })

  loadRender()
}

window.onload = init