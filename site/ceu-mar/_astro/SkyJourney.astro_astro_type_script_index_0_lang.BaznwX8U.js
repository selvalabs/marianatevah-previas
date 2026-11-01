function e(){let e=document.querySelector(`#sky-journey`),t=document.querySelector(`[data-sky-world]`),n=document.querySelector(`.sky-motion`);if(!e||!t||!n)return;let r=matchMedia(`(prefers-reduced-motion: reduce)`),i=[...document.querySelectorAll(`main>.hero,main>.chapter`)],a=[];function o(){a=i.map(e=>e.getBoundingClientRect().top+scrollY),a.push(Math.max(a.at(-1)+1,document.documentElement.scrollHeight-innerHeight))}function s(){let e=scrollY,t=0;for(;t<a.length-2&&e>a[t+1];)t++;let n=Math.max(0,Math.min(1,(e-a[t])/Math.max(1,a[t+1]-a[t])));return Math.min(1,(t+n)/(a.length-1))}let c=!1;function l(){if(c)return;c=!0,t.dataset.renderer=`poster`,t.dataset.motion=`static`,n.hidden=!0;let e=!1;function r(){e=!1;let n=s(),r=(e,t)=>Math.round(e+(t-e)*n);t.style.setProperty(`--fallback-tint`,`rgb(${r(246,49)} ${r(255,65)} ${r(255,98)} / ${.1+n*.7})`);let i=Math.max(0,Math.min(1,(innerWidth/innerHeight-.8)/.3)),a=1-i*i*(3-2*i),o=60-2*a,c=19+5*a;t.style.setProperty(`--fallback-horizon`,`${o}%`),t.style.setProperty(`--fallback-sun-y`,`${c+(o-c)*n/.86}vh`),t.style.setProperty(`--fallback-sun-x`,`${84+a-12*n}%`),t.style.setProperty(`--fallback-sun-alpha`,String(1-Math.max(0,Math.min(1,(n-.84)/.12)))),t.style.setProperty(`--fallback-venus-alpha`,String(Math.max(0,Math.min(1,(n-.82)/.16)))),t.dataset.progress=n.toFixed(4)}function i(){e||(e=!0,requestAnimationFrame(r))}function a(){o(),i()}window.addEventListener(`scroll`,i,{passive:!0}),window.addEventListener(`resize`,a,{passive:!0}),new ResizeObserver(a).observe(document.querySelector(`main`)),document.fonts.ready.then(a),a()}let u=e.getContext(`webgl`,{alpha:!1,antialias:!1,powerPreference:`low-power`});if(!u){l();return}function d(e,t){let n=u.createShader(e);return u.shaderSource(n,t),u.compileShader(n),u.getShaderParameter(n,u.COMPILE_STATUS)?n:(u.deleteShader(n),null)}let f=d(u.VERTEX_SHADER,`attribute vec2 a_position; varying vec2 v_uv; void main(){v_uv=a_position*.5+.5;gl_Position=vec4(a_position,0.,1.);}`),p=d(u.FRAGMENT_SHADER,`
precision mediump float;
varying vec2 v_uv;
uniform sampler2D u_photo;
uniform vec2 u_resolution;
uniform float u_progress,u_time;
vec3 palette(float p,vec3 a,vec3 b,vec3 c,vec3 d){
 if(p<.4)return mix(a,b,smoothstep(0.,.4,p));
 if(p<.76)return mix(b,c,smoothstep(.4,.76,p));
 return mix(c,d,smoothstep(.76,1.,p));
}
void main(){
 vec2 uv=vec2(v_uv.x,1.-v_uv.y);
 float p=u_progress,aspect=u_resolution.x/u_resolution.y;
 float portrait=1.-smoothstep(.8,1.1,aspect);
 float horizon=mix(.60,.58,portrait),sea=step(horizon,uv.y),depth=max(0.,(uv.y-horizon)/(1.-horizon));
 vec2 sampleUV=vec2(.5+(uv.x-.5)*min(1.,aspect/1.777),uv.y<horizon?uv.y/horizon*.606:.606+depth*.394);
 // Travelling swells and cross ripples; keep the horizon anchored.
 float waterMask=sea*smoothstep(0.,.045,depth);
 float swell=sin(uv.y*65.-u_time*1.1+sin(uv.x*7.+u_time*.3)*.6);
 float crossing=sin(uv.x*16.+uv.y*36.+u_time*.8);
 float perspective=.15+.85*depth;
 sampleUV.x+=waterMask*(swell*.0055+crossing*.002)*perspective;
 sampleUV.y+=waterMask*sin(uv.x*10.+uv.y*38.-u_time*.85)*.003*perspective;
 sampleUV.x+=(1.-sea)*sin(u_time*.025)*.003;
 vec3 photo=texture2D(u_photo,sampleUV).rgb;
 vec3 top=palette(p,vec3(.69,.83,.88),vec3(.72,.78,.82),vec3(.53,.49,.62),vec3(.10,.16,.25));
 vec3 mid=palette(p,vec3(.89,.94,.92),vec3(.94,.84,.70),vec3(.88,.63,.57),vec3(.27,.30,.43));
 vec3 low=palette(p,vec3(.98,.95,.85),vec3(1.,.86,.64),vec3(.99,.69,.42),vec3(.71,.48,.45));
 vec3 sky=mix(top,mid,smoothstep(0.,.51,uv.y/horizon));
 sky=mix(sky,low,smoothstep(.45,1.,uv.y/horizon));
 float light=dot(photo,vec3(.299,.587,.114));
 sky+=vec3((light-.71)*.21)*(1.-p*.4);
 vec3 ocean=palette(p,vec3(.29,.50,.56),vec3(.36,.49,.51),vec3(.41,.36,.45),vec3(.12,.21,.30));
 ocean=mix(ocean,low,.18*(1.-depth));
 ocean*=.52+light*1.23;
 // Moving crest light is visible even over the quieter parts of the photograph.
 float ripple=sin(uv.y*180.-u_time*1.5+uv.x*7.)*sin(uv.x*32.+u_time*.7);
 ocean+=vec3(.055,.07,.075)*ripple*waterMask*(.25+.75*depth);
 float sunStart=mix(.19,.24,portrait);
 vec2 sun=vec2(mix(.84,.85,portrait)-.12*p,sunStart+(horizon-sunStart)*p/.86);
 vec2 delta=vec2((uv.x-sun.x)*aspect,uv.y-sun.y);
 float radius=mix(.030,.046,portrait),dist=length(delta),day=1.-smoothstep(.87,.96,p);
 float disk=1.-smoothstep(radius-.0015,radius+.002,dist);
 sky+=vec3(.18,.105,.025)*exp(-dist*7.)*day;
 sky=mix(sky,mix(vec3(1.,.953,.79),vec3(1.,.91,.66),portrait),disk*day);
 float reflection=exp(-pow((uv.x-sun.x)*aspect/(.008+depth*.11),2.));
 float glint=smoothstep(.52,.84,light+sin(uv.y*400.-u_time*1.2)*.11);
 ocean+=vec3(.8,.55,.23)*reflection*glint*(.42-depth*.18)*day;
 vec2 venus=vec2(.85,.39),vd=vec2((uv.x-venus.x)*aspect,uv.y-venus.y);
 float vdlen=length(vd),rise=smoothstep(.82,.98,p);
 sky+=vec3(.95,.88,.70)*(exp(-vdlen*260.)*.4+1.-smoothstep(.001,.0026,vdlen))*rise;
 vec3 color=mix(sky,ocean,sea);
 color=mix(color,low,exp(-abs(uv.y-horizon)*250.)*.17);
 gl_FragColor=vec4(color,1.);
}`);if(!f||!p){l();return}let m=u.createProgram();if(u.attachShader(m,f),u.attachShader(m,p),u.linkProgram(m),!u.getProgramParameter(m,u.LINK_STATUS)){l();return}u.useProgram(m);let h=u.createBuffer();u.bindBuffer(u.ARRAY_BUFFER,h),u.bufferData(u.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),u.STATIC_DRAW);let g=u.getAttribLocation(m,`a_position`);u.enableVertexAttribArray(g),u.vertexAttribPointer(g,2,u.FLOAT,!1,0,0);let _={resolution:u.getUniformLocation(m,`u_resolution`),progress:u.getUniformLocation(m,`u_progress`),time:u.getUniformLocation(m,`u_time`)},v=u.createTexture();u.bindTexture(u.TEXTURE_2D,v),u.texParameteri(u.TEXTURE_2D,u.TEXTURE_WRAP_S,u.CLAMP_TO_EDGE),u.texParameteri(u.TEXTURE_2D,u.TEXTURE_WRAP_T,u.CLAMP_TO_EDGE),u.texParameteri(u.TEXTURE_2D,u.TEXTURE_MIN_FILTER,u.LINEAR),u.texParameteri(u.TEXTURE_2D,u.TEXTURE_MAG_FILTER,u.LINEAR);let y=!1,b=!1,x=!1,S=0,C=0,w=0,T=0,E=!0;function D(){o();let t=Math.min(devicePixelRatio||1,innerWidth<760?1.25:1.5);e.width=Math.round(innerWidth*t),e.height=Math.round(innerHeight*t),u.viewport(0,0,e.width,e.height),E=!0,k()}function O(n){if(S=0,!y||b||document.hidden)return;let i=!x&&!r.matches;t.dataset.motion!==(i?`playing`:`paused`)&&A(),(n-w>=1e3/30||E)&&(i&&(C+=Math.max(0,(n-w)/1e3)),w=n,T=s(),u.uniform2f(_.resolution,e.width,e.height),u.uniform1f(_.progress,T),u.uniform1f(_.time,C),u.drawArrays(u.TRIANGLES,0,6),t.dataset.progress=T.toFixed(4),t.dataset.phase=T<.26?`day`:T<.62?`golden`:T<.85?`sunset`:`venus`,t.dataset.time=C.toFixed(3),E=!1),i&&(S=requestAnimationFrame(O))}function k(){!S&&y&&!b&&!document.hidden&&(S=requestAnimationFrame(O))}function A(){let e=x||r.matches;t.dataset.motion=e?`paused`:`playing`,document.documentElement.dataset.seaMotion=e?`paused`:`playing`,n.hidden=r.matches,n.setAttribute(`aria-pressed`,String(e)),n.setAttribute(`aria-label`,e?`Ativar movimento do céu e do mar`:`Pausar movimento do céu e do mar`),n.querySelector(`.sky-motion__label`).textContent=e?`Ativar movimento`:`Pausar movimento`}function j(){c?(n.hidden=!0,t.dataset.motion=`static`):(A(),cancelAnimationFrame(S),S=0,E=!0,w=performance.now(),k())}n.addEventListener(`click`,()=>{r.matches||(x=!x,j())}),r.onchange=j,window.addEventListener(`scroll`,()=>{E=!0,k()},{passive:!0}),window.addEventListener(`resize`,D,{passive:!0}),document.addEventListener(`visibilitychange`,()=>{document.hidden?(cancelAnimationFrame(S),S=0,t.dataset.motion=`hidden`):j()}),window.addEventListener(`pageshow`,D),new ResizeObserver(D).observe(document.querySelector(`main`)),document.fonts.ready.then(D),e.addEventListener(`webglcontextlost`,e=>{e.preventDefault(),b=!0,cancelAnimationFrame(S),S=0,l()}),e.addEventListener(`webglcontextrestored`,()=>{l()});let M=new Image;M.onload=()=>{u.bindTexture(u.TEXTURE_2D,v),u.texImage2D(u.TEXTURE_2D,0,u.RGB,u.RGB,u.UNSIGNED_BYTE,M),y=!0,t.dataset.renderer=`webgl`,n.hidden=r.matches,D(),j()},M.onerror=l,M.src=`/marianatevah-previas/ceu-mar/images/ocean-horizon-v1.webp`}e();