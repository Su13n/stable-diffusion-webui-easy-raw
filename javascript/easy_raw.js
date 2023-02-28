//Copied some snippets from the naiprompt2webui extension because I didn't know how to create a button where I wanted it.

const params = [];

// Parses raw parameters
function parse_parameters(input) {
    params["Positive"] = input.substring(0, input.indexOf("Negative prompt"))
    input = input.slice(input.indexOf("Negative prompt")+17)
    params["Negative"] = input.substring(0, input.indexOf("\n"))
    input = input.slice(input.indexOf("\n"))
    input = input.replaceAll("\n", "") + ", ";

    let categoryName;
    while (input.match(": ")) {
      categoryName = input.substring(0, input.indexOf(": "));

      input = input.slice(input.indexOf(": ")+2)
      params[categoryName] = input.substring(0, input.indexOf(", "));
      input = input.slice(input.indexOf(", ")+2)

    }
    return params;
}

//apply settings
function onClickConvert() {

    let params = parse_parameters(gradioApp().querySelector("#txt2img_prompt > label > textarea").value);

    //positive prompt
    let target = gradioApp().querySelector("#txt2img_prompt > label > textarea");    
    target.value = params["Positive"];
    updateInput(target);
    
    //negative prompt
    target = gradioApp().querySelector("#txt2img_neg_prompt > label > textarea");   
    target.value = params["Negative"];
    updateInput(target);

    //size width
    target = gradioApp().querySelector("#txt2img_width .gr-text-input");
    target.value = params["Size"].split("x")[0];
    updateInput(target);

    //size height
    target = gradioApp().querySelector("#txt2img_height .gr-text-input");
    target.value = params["Size"].split("x")[1];
    updateInput(target);
    
    //seed
    target = gradioApp().querySelector("#txt2img_seed .gr-text-input");    
    target.value = params["Seed"];
    updateInput(target);

    //model
    target = gradioApp().querySelector("#setting_sd_model_checkpoint .w-full");
    let hash = params["Model hash"];
    for (let i = 0; i < target.options.length; i++) {
        let webuiModel = target.options[i].value;
        if (webuiModel.includes(hash)) {
            selectCheckpoint(webuiModel);
            break;
        }
    }

    //txt2img_steps
    target = gradioApp().querySelector("#txt2img_steps .gr-text-input");
    target.value = params["Steps"];
    updateInput(target);

    //txt2img_sampling
    target = gradioApp().querySelector("#txt2img_sampling label .w-full");
    for (let i = 0; i < target.options.length; i++) {
        
        if (target.options[i].value == params["Sampler"]) {
            for (j = 0; j < target.options.length; j++) {
                target.options[j].selected = false;
            };
            target.options[i].selected = true;
            target.value = params["Sampler"];
            break;
        }
    }
    
    //tried api until I realised most people would not have the api enabled
    /*let option_payload = {
        "Seed": 123456789,
        "CLIP_stop_at_last_layers": 5
    }
    fetch("http://127.0.0.1:7860/sdapi/v1/options", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(option_payload)
    })
        .then(response => {
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
        */
    
    
    //cfg scale
    target = gradioApp().querySelector("#txt2img_cfg_scale .gr-text-input");
    target.value = params["CFG scale"];
    updateInput(target);

    //txt2img_enable_hr
    target = gradioApp().querySelector("#txt2img_enable_hr .flex.items-center");
    //trying something else, maybe it works
    if (params["Hires upscaler"] != "") {
        var event = new Event('click');
        target.dispatchEvent(event);
        target.checked = true;
        //console.log(gradioApp().querySelector("#txt2img_hires_fix").hidden);
        //gradioApp().querySelector("#txt2img_hires_fix").hidden = false;
        //console.log(gradioApp().querySelector("#txt2img_hires_fix").hidden);
        updateInput(target);
    };
    
    //txt2img_denoising_strength
    target = gradioApp().querySelector("#txt2img_denoising_strength .gr-text-input");
    target.value = params["Denoising strength"]
    updateInput(target);

    //txt2img_hr_scale
    target = gradioApp().querySelector("#txt2img_hr_scale .gr-text-input");
    target.value = params["Hires upscale"]
    updateInput(target);

    //txt2img_hires_steps
    target = gradioApp().querySelector("#txt2img_hires_steps .gr-text-input");
    target.value = params["Hires steps"]
    updateInput(target);

    //txt2img_hr_upscaler
    target = gradioApp().querySelector("#txt2img_hr_upscaler select");
    //console.log(target.options)
    for(let i = 0; i < target.options.length; i++) {
        console.log("Option: " + target.options[i].value);
        if(target.options[i].value == params["Hires upscaler"]) {
            for(let j = 0; j < target.options.length; j++) {
                target.options[j].selected = false;
            }
            target.options[i].selected = true;
            target.value = params["Hires upscaler"]
            console.log("YES?");
        };
    };
    updateInput(target);

    

}
  
function createButton(id, innerHTML, onClick) {
    const button = document.createElement("button");
    button.id = id;
    button.type = "button";
    button.innerHTML = innerHTML;
    button.className = "gr-button gr-button-lg gr-button-secondary";
    button.style = `padding-left: 0.1em; padding-right: 0em; margin: 0.1em 0;max-height: 2em; max-width: 10em`;
    button.addEventListener("click", onClick);
    return button;
}

onUiUpdate(() => {
    const generateBtn = gradioApp().querySelector("#txt2img_generate");
    const actionsColumn = gradioApp().querySelector("#txt2img_actions_column");
    const raw2local = gradioApp().querySelector("#raw2local");

    if (!generateBtn || !actionsColumn || raw2local) return;

    const raw2LocalArea = document.createElement("div");
    raw2LocalArea.id = "raw2local";
    raw2LocalArea.className = "overflow-hidden flex col gap-4";
    raw2LocalArea.style = "padding: 0.4em 0em";
    
    const parseBtn = createButton("parseparameters", "Apply Raw Settings", onClickConvert);
    
    raw2LocalArea.appendChild(parseBtn);

    actionsColumn.append(raw2LocalArea);
});
