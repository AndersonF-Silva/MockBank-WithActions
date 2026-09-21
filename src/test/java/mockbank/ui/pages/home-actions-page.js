function HomeActionsPage() {
    var page = {};

    // --- Snippet reutilizado: busca elementos atravessando Shadow DOM aninhado ---
    // Necessário porque document.querySelectorAll puro não enxerga elementos
    // dentro de shadow roots de componentes Vaadin, causando falsos negativos
    // intermitentes quando o layout ainda está terminando de montar.
    var DEEP_QUERY_ALL_FN =
        "function deepQueryAll(selector, root){ \
            root = root || document; \
            var results = Array.from(root.querySelectorAll(selector)); \
            var all = root.querySelectorAll('*'); \
            all.forEach(function(el){ \
                if (el.shadowRoot) { \
                    results = results.concat(deepQueryAll(selector, el.shadowRoot)); \
                } \
            }); \
            return results; \
        }";

    // --- Presença dos botões/cards ---
    page.isLetsStartButtonPresent = () => driver.script(
        DEEP_QUERY_ALL_FN + "; \
        deepQueryAll('vaadin-button').some(function(b){ \
            return (b.textContent||'').replace(/[\u2018\u2019]/g,\"'\").trim().includes(\"Let's Start\"); \
        })"
    );

    page.isQuickStartCardPresent = () => driver.exists("{^}Quick start") && driver.exists("{^}Get up and running in 2 minutes!");

    page.isConnectAispCardPresent = () => driver.exists("{^}Connect Using partner") && driver.exists("{^}Use MockBank with AISP.");

    page.isAllTutorialsCardPresent = () => driver.exists("{^}All Tutorials");

    page.isConnectDirectlyCardPresent = () => driver.exists("{^}Connect directly");
    page.isUsingInternalApiCardPresent = () => driver.exists("{^}Using Internal API");

    // --- Cliques nos botões (busca profunda em shadow DOM) ---
    page.clickLetsStartButton = () => driver.script(
        DEEP_QUERY_ALL_FN + "; \
        (function(){ \
            var btns = deepQueryAll('vaadin-button'); \
            var target = btns.find(function(b){ \
                return (b.textContent||'').replace(/[\u2018\u2019]/g,\"'\").trim().includes(\"Let's Start\"); \
            }); \
            if(!target) return 'BOTAO NAO ENCONTRADO'; \
            target.click(); \
            return 'CLICK DISPARADO'; \
        })()"
    );

    page.clickAllTutorialsMore = () => driver.script(
        DEEP_QUERY_ALL_FN + "; \
        (function(){ \
            var btns = deepQueryAll('vaadin-button'); \
            var target = btns.find(function(b){ \
                return (b.textContent||'').trim()==='More' && document.body.innerText.includes('All Tutorials'); \
            }); \
            if(!target) return 'BOTAO NAO ENCONTRADO'; \
            target.click(); \
            return 'CLICK DISPARADO'; \
        })()"
    );

    page.clickConnectAispMore = () => driver.script(
        DEEP_QUERY_ALL_FN + "; \
        (function(){ \
            var btns = deepQueryAll('vaadin-button'); \
            var target = btns.find(function(b){ \
                return (b.textContent||'').trim()==='More' && document.body.innerText.includes('Connect Using partner'); \
            }); \
            if(!target) return 'BOTAO NAO ENCONTRADO'; \
            target.click(); \
            return 'CLICK DISPARADO'; \
        })()"
    );

    page.clickConnectDirectlyMore = () => driver.script(
        DEEP_QUERY_ALL_FN + "; \
        (function(){ \
            var btns = deepQueryAll('vaadin-button'); \
            var target = btns.find(function(b){ \
                return (b.textContent||'').trim()==='More' && document.body.innerText.includes('Connect directly'); \
            }); \
            if(!target) return 'BOTAO NAO ENCONTRADO'; \
            target.click(); \
            return 'CLICK DISPARADO'; \
        })()"
    );

    page.clickUsingInternalApiMore = () => driver.script(
        DEEP_QUERY_ALL_FN + "; \
        (function(){ \
            var btns = deepQueryAll('vaadin-button'); \
            var target = btns.find(function(b){ \
                return (b.textContent||'').trim()==='More' && document.body.innerText.includes('Using Internal API'); \
            }); \
            if(!target) return 'BOTAO NAO ENCONTRADO'; \
            target.click(); \
            return 'CLICK DISPARADO'; \
        })()"
    );

    return page;
}