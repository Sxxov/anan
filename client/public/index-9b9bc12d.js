
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
function noop$1() { }
const identity = x => x;
function assign(tar, src) {
    // @ts-ignore
    for (const k in src)
        tar[k] = src[k];
    return tar;
}
function is_promise(value) {
    return value && typeof value === 'object' && typeof value.then === 'function';
}
function add_location(element, file, line, column, char) {
    element.__svelte_meta = {
        loc: { file, line, column, char }
    };
}
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function is_function(thing) {
    return typeof thing === 'function';
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
function not_equal(a, b) {
    return a != a ? b == b : a !== b;
}
function is_empty(obj) {
    return Object.keys(obj).length === 0;
}
function validate_store(store, name) {
    if (store != null && typeof store.subscribe !== 'function') {
        throw new Error(`'${name}' is not a store with a 'subscribe' method`);
    }
}
function subscribe(store, ...callbacks) {
    if (store == null) {
        return noop$1;
    }
    const unsub = store.subscribe(...callbacks);
    return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function get_store_value(store) {
    let value;
    subscribe(store, _ => value = _)();
    return value;
}
function component_subscribe(component, store, callback) {
    component.$$.on_destroy.push(subscribe(store, callback));
}
function create_slot(definition, ctx, $$scope, fn) {
    if (definition) {
        const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
        return definition[0](slot_ctx);
    }
}
function get_slot_context(definition, ctx, $$scope, fn) {
    return definition[1] && fn
        ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
        : $$scope.ctx;
}
function get_slot_changes(definition, $$scope, dirty, fn) {
    if (definition[2] && fn) {
        const lets = definition[2](fn(dirty));
        if ($$scope.dirty === undefined) {
            return lets;
        }
        if (typeof lets === 'object') {
            const merged = [];
            const len = Math.max($$scope.dirty.length, lets.length);
            for (let i = 0; i < len; i += 1) {
                merged[i] = $$scope.dirty[i] | lets[i];
            }
            return merged;
        }
        return $$scope.dirty | lets;
    }
    return $$scope.dirty;
}
function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
    const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
    if (slot_changes) {
        const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
        slot.p(slot_context, slot_changes);
    }
}
function update_slot_spread(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_spread_changes_fn, get_slot_context_fn) {
    const slot_changes = get_slot_spread_changes_fn(dirty) | get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
    if (slot_changes) {
        const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
        slot.p(slot_context, slot_changes);
    }
}
function exclude_internal_props(props) {
    const result = {};
    for (const k in props)
        if (k[0] !== '$')
            result[k] = props[k];
    return result;
}
function compute_rest_props(props, keys) {
    const rest = {};
    keys = new Set(keys);
    for (const k in props)
        if (!keys.has(k) && k[0] !== '$')
            rest[k] = props[k];
    return rest;
}
function compute_slots(slots) {
    const result = {};
    for (const key in slots) {
        result[key] = true;
    }
    return result;
}
function once(fn) {
    let ran = false;
    return function (...args) {
        if (ran)
            return;
        ran = true;
        fn.call(this, ...args);
    };
}
function null_to_empty(value) {
    return value == null ? '' : value;
}
function set_store_value(store, ret, value = ret) {
    store.set(value);
    return ret;
}
const has_prop = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
function action_destroyer(action_result) {
    return action_result && is_function(action_result.destroy) ? action_result.destroy : noop$1;
}

const is_client = typeof window !== 'undefined';
let now = is_client
    ? () => window.performance.now()
    : () => Date.now();
let raf = is_client ? cb => requestAnimationFrame(cb) : noop$1;
// used internally for testing
function set_now(fn) {
    now = fn;
}
function set_raf(fn) {
    raf = fn;
}

const tasks = new Set();
function run_tasks(now) {
    tasks.forEach(task => {
        if (!task.c(now)) {
            tasks.delete(task);
            task.f();
        }
    });
    if (tasks.size !== 0)
        raf(run_tasks);
}
/**
 * For testing purposes only!
 */
function clear_loops() {
    tasks.clear();
}
/**
 * Creates a new task that runs on each raf frame
 * until it returns a falsy value or is aborted
 */
function loop(callback) {
    let task;
    if (tasks.size === 0)
        raf(run_tasks);
    return {
        promise: new Promise(fulfill => {
            tasks.add(task = { c: callback, f: fulfill });
        }),
        abort() {
            tasks.delete(task);
        }
    };
}

function append(target, node) {
    target.appendChild(node);
}
function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
}
function detach(node) {
    node.parentNode.removeChild(node);
}
function destroy_each(iterations, detaching) {
    for (let i = 0; i < iterations.length; i += 1) {
        if (iterations[i])
            iterations[i].d(detaching);
    }
}
function element(name) {
    return document.createElement(name);
}
function element_is(name, is) {
    return document.createElement(name, { is });
}
function object_without_properties(obj, exclude) {
    const target = {};
    for (const k in obj) {
        if (has_prop(obj, k)
            // @ts-ignore
            && exclude.indexOf(k) === -1) {
            // @ts-ignore
            target[k] = obj[k];
        }
    }
    return target;
}
function svg_element(name) {
    return document.createElementNS('http://www.w3.org/2000/svg', name);
}
function text(data) {
    return document.createTextNode(data);
}
function space() {
    return text(' ');
}
function empty() {
    return text('');
}
function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
}
function prevent_default(fn) {
    return function (event) {
        event.preventDefault();
        // @ts-ignore
        return fn.call(this, event);
    };
}
function stop_propagation(fn) {
    return function (event) {
        event.stopPropagation();
        // @ts-ignore
        return fn.call(this, event);
    };
}
function self$1(fn) {
    return function (event) {
        // @ts-ignore
        if (event.target === this)
            fn.call(this, event);
    };
}
function attr(node, attribute, value) {
    if (value == null)
        node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
        node.setAttribute(attribute, value);
}
function set_attributes(node, attributes) {
    // @ts-ignore
    const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
    for (const key in attributes) {
        if (attributes[key] == null) {
            node.removeAttribute(key);
        }
        else if (key === 'style') {
            node.style.cssText = attributes[key];
        }
        else if (key === '__value') {
            node.value = node[key] = attributes[key];
        }
        else if (descriptors[key] && descriptors[key].set) {
            node[key] = attributes[key];
        }
        else {
            attr(node, key, attributes[key]);
        }
    }
}
function set_svg_attributes(node, attributes) {
    for (const key in attributes) {
        attr(node, key, attributes[key]);
    }
}
function set_custom_element_data(node, prop, value) {
    if (prop in node) {
        node[prop] = typeof node[prop] === 'boolean' && value === '' ? true : value;
    }
    else {
        attr(node, prop, value);
    }
}
function xlink_attr(node, attribute, value) {
    node.setAttributeNS('http://www.w3.org/1999/xlink', attribute, value);
}
function get_binding_group_value(group, __value, checked) {
    const value = new Set();
    for (let i = 0; i < group.length; i += 1) {
        if (group[i].checked)
            value.add(group[i].__value);
    }
    if (!checked) {
        value.delete(__value);
    }
    return Array.from(value);
}
function to_number(value) {
    return value === '' ? null : +value;
}
function time_ranges_to_array(ranges) {
    const array = [];
    for (let i = 0; i < ranges.length; i += 1) {
        array.push({ start: ranges.start(i), end: ranges.end(i) });
    }
    return array;
}
function children(element) {
    return Array.from(element.childNodes);
}
function claim_element(nodes, name, attributes, svg) {
    for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        if (node.nodeName === name) {
            let j = 0;
            const remove = [];
            while (j < node.attributes.length) {
                const attribute = node.attributes[j++];
                if (!attributes[attribute.name]) {
                    remove.push(attribute.name);
                }
            }
            for (let k = 0; k < remove.length; k++) {
                node.removeAttribute(remove[k]);
            }
            return nodes.splice(i, 1)[0];
        }
    }
    return svg ? svg_element(name) : element(name);
}
function claim_text(nodes, data) {
    for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        if (node.nodeType === 3) {
            node.data = '' + data;
            return nodes.splice(i, 1)[0];
        }
    }
    return text(data);
}
function claim_space(nodes) {
    return claim_text(nodes, ' ');
}
function set_data(text, data) {
    data = '' + data;
    if (text.wholeText !== data)
        text.data = data;
}
function set_input_value(input, value) {
    input.value = value == null ? '' : value;
}
function set_input_type(input, type) {
    try {
        input.type = type;
    }
    catch (e) {
        // do nothing
    }
}
function set_style(node, key, value, important) {
    node.style.setProperty(key, value, important ? 'important' : '');
}
function select_option(select, value) {
    for (let i = 0; i < select.options.length; i += 1) {
        const option = select.options[i];
        if (option.__value === value) {
            option.selected = true;
            return;
        }
    }
}
function select_options(select, value) {
    for (let i = 0; i < select.options.length; i += 1) {
        const option = select.options[i];
        option.selected = ~value.indexOf(option.__value);
    }
}
function select_value(select) {
    const selected_option = select.querySelector(':checked') || select.options[0];
    return selected_option && selected_option.__value;
}
function select_multiple_value(select) {
    return [].map.call(select.querySelectorAll(':checked'), option => option.__value);
}
// unfortunately this can't be a constant as that wouldn't be tree-shakeable
// so we cache the result instead
let crossorigin;
function is_crossorigin() {
    if (crossorigin === undefined) {
        crossorigin = false;
        try {
            if (typeof window !== 'undefined' && window.parent) {
                void window.parent.document;
            }
        }
        catch (error) {
            crossorigin = true;
        }
    }
    return crossorigin;
}
function add_resize_listener(node, fn) {
    const computed_style = getComputedStyle(node);
    if (computed_style.position === 'static') {
        node.style.position = 'relative';
    }
    const iframe = element('iframe');
    iframe.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; ' +
        'overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;');
    iframe.setAttribute('aria-hidden', 'true');
    iframe.tabIndex = -1;
    const crossorigin = is_crossorigin();
    let unsubscribe;
    if (crossorigin) {
        iframe.src = "data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}</script>";
        unsubscribe = listen(window, 'message', (event) => {
            if (event.source === iframe.contentWindow)
                fn();
        });
    }
    else {
        iframe.src = 'about:blank';
        iframe.onload = () => {
            unsubscribe = listen(iframe.contentWindow, 'resize', fn);
        };
    }
    append(node, iframe);
    return () => {
        if (crossorigin) {
            unsubscribe();
        }
        else if (unsubscribe && iframe.contentWindow) {
            unsubscribe();
        }
        detach(iframe);
    };
}
function toggle_class(element, name, toggle) {
    element.classList[toggle ? 'add' : 'remove'](name);
}
function custom_event(type, detail) {
    const e = document.createEvent('CustomEvent');
    e.initCustomEvent(type, false, false, detail);
    return e;
}
function query_selector_all(selector, parent = document.body) {
    return Array.from(parent.querySelectorAll(selector));
}
class HtmlTag {
    constructor(anchor = null) {
        this.a = anchor;
        this.e = this.n = null;
    }
    m(html, target, anchor = null) {
        if (!this.e) {
            this.e = element(target.nodeName);
            this.t = target;
            this.h(html);
        }
        this.i(anchor);
    }
    h(html) {
        this.e.innerHTML = html;
        this.n = Array.from(this.e.childNodes);
    }
    i(anchor) {
        for (let i = 0; i < this.n.length; i += 1) {
            insert(this.t, this.n[i], anchor);
        }
    }
    p(html) {
        this.d();
        this.h(html);
        this.i(this.a);
    }
    d() {
        this.n.forEach(detach);
    }
}
function attribute_to_object(attributes) {
    const result = {};
    for (const attribute of attributes) {
        result[attribute.name] = attribute.value;
    }
    return result;
}
function get_custom_elements_slots(element) {
    const result = {};
    element.childNodes.forEach((node) => {
        result[node.slot || 'default'] = true;
    });
    return result;
}

const active_docs = new Set();
let active = 0;
// https://github.com/darkskyapp/string-hash/blob/master/index.js
function hash(str) {
    let hash = 5381;
    let i = str.length;
    while (i--)
        hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
    return hash >>> 0;
}
function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
    const step = 16.666 / duration;
    let keyframes = '{\n';
    for (let p = 0; p <= 1; p += step) {
        const t = a + (b - a) * ease(p);
        keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
    }
    const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
    const name = `__svelte_${hash(rule)}_${uid}`;
    const doc = node.ownerDocument;
    active_docs.add(doc);
    const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(element('style')).sheet);
    const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
    if (!current_rules[name]) {
        current_rules[name] = true;
        stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
    }
    const animation = node.style.animation || '';
    node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
    active += 1;
    return name;
}
function delete_rule(node, name) {
    const previous = (node.style.animation || '').split(', ');
    const next = previous.filter(name
        ? anim => anim.indexOf(name) < 0 // remove specific animation
        : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
    );
    const deleted = previous.length - next.length;
    if (deleted) {
        node.style.animation = next.join(', ');
        active -= deleted;
        if (!active)
            clear_rules();
    }
}
function clear_rules() {
    raf(() => {
        if (active)
            return;
        active_docs.forEach(doc => {
            const stylesheet = doc.__svelte_stylesheet;
            let i = stylesheet.cssRules.length;
            while (i--)
                stylesheet.deleteRule(i);
            doc.__svelte_rules = {};
        });
        active_docs.clear();
    });
}

function create_animation(node, from, fn, params) {
    if (!from)
        return noop$1;
    const to = node.getBoundingClientRect();
    if (from.left === to.left && from.right === to.right && from.top === to.top && from.bottom === to.bottom)
        return noop$1;
    const { delay = 0, duration = 300, easing = identity, 
    // @ts-ignore todo: should this be separated from destructuring? Or start/end added to public api and documentation?
    start: start_time = now() + delay, 
    // @ts-ignore todo:
    end = start_time + duration, tick = noop$1, css } = fn(node, { from, to }, params);
    let running = true;
    let started = false;
    let name;
    function start() {
        if (css) {
            name = create_rule(node, 0, 1, duration, delay, easing, css);
        }
        if (!delay) {
            started = true;
        }
    }
    function stop() {
        if (css)
            delete_rule(node, name);
        running = false;
    }
    loop(now => {
        if (!started && now >= start_time) {
            started = true;
        }
        if (started && now >= end) {
            tick(1, 0);
            stop();
        }
        if (!running) {
            return false;
        }
        if (started) {
            const p = now - start_time;
            const t = 0 + 1 * easing(p / duration);
            tick(t, 1 - t);
        }
        return true;
    });
    start();
    tick(0, 1);
    return stop;
}
function fix_position(node) {
    const style = getComputedStyle(node);
    if (style.position !== 'absolute' && style.position !== 'fixed') {
        const { width, height } = style;
        const a = node.getBoundingClientRect();
        node.style.position = 'absolute';
        node.style.width = width;
        node.style.height = height;
        add_transform(node, a);
    }
}
function add_transform(node, a) {
    const b = node.getBoundingClientRect();
    if (a.left !== b.left || a.top !== b.top) {
        const style = getComputedStyle(node);
        const transform = style.transform === 'none' ? '' : style.transform;
        node.style.transform = `${transform} translate(${a.left - b.left}px, ${a.top - b.top}px)`;
    }
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
function get_current_component() {
    if (!current_component)
        throw new Error('Function called outside component initialization');
    return current_component;
}
function beforeUpdate(fn) {
    get_current_component().$$.before_update.push(fn);
}
function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
}
function afterUpdate(fn) {
    get_current_component().$$.after_update.push(fn);
}
function onDestroy(fn) {
    get_current_component().$$.on_destroy.push(fn);
}
function createEventDispatcher() {
    const component = get_current_component();
    return (type, detail) => {
        const callbacks = component.$$.callbacks[type];
        if (callbacks) {
            // TODO are there situations where events could be dispatched
            // in a server (non-DOM) environment?
            const event = custom_event(type, detail);
            callbacks.slice().forEach(fn => {
                fn.call(component, event);
            });
        }
    };
}
function setContext(key, context) {
    get_current_component().$$.context.set(key, context);
}
function getContext(key) {
    return get_current_component().$$.context.get(key);
}
function hasContext(key) {
    return get_current_component().$$.context.has(key);
}
// TODO figure out if we still want to support
// shorthand events, or if we want to implement
// a real bubbling mechanism
function bubble(component, event) {
    const callbacks = component.$$.callbacks[event.type];
    if (callbacks) {
        callbacks.slice().forEach(fn => fn(event));
    }
}

const dirty_components = [];
const intros = { enabled: false };
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
function schedule_update() {
    if (!update_scheduled) {
        update_scheduled = true;
        resolved_promise.then(flush);
    }
}
function tick() {
    schedule_update();
    return resolved_promise;
}
function add_render_callback(fn) {
    render_callbacks.push(fn);
}
function add_flush_callback(fn) {
    flush_callbacks.push(fn);
}
let flushing = false;
const seen_callbacks = new Set();
function flush() {
    if (flushing)
        return;
    flushing = true;
    do {
        // first, call beforeUpdate functions
        // and update components
        for (let i = 0; i < dirty_components.length; i += 1) {
            const component = dirty_components[i];
            set_current_component(component);
            update(component.$$);
        }
        set_current_component(null);
        dirty_components.length = 0;
        while (binding_callbacks.length)
            binding_callbacks.pop()();
        // then, once components are updated, call
        // afterUpdate functions. This may cause
        // subsequent updates...
        for (let i = 0; i < render_callbacks.length; i += 1) {
            const callback = render_callbacks[i];
            if (!seen_callbacks.has(callback)) {
                // ...so guard against infinite loops
                seen_callbacks.add(callback);
                callback();
            }
        }
        render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
        flush_callbacks.pop()();
    }
    update_scheduled = false;
    flushing = false;
    seen_callbacks.clear();
}
function update($$) {
    if ($$.fragment !== null) {
        $$.update();
        run_all($$.before_update);
        const dirty = $$.dirty;
        $$.dirty = [-1];
        $$.fragment && $$.fragment.p($$.ctx, dirty);
        $$.after_update.forEach(add_render_callback);
    }
}

let promise;
function wait() {
    if (!promise) {
        promise = Promise.resolve();
        promise.then(() => {
            promise = null;
        });
    }
    return promise;
}
function dispatch(node, direction, kind) {
    node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
}
const outroing = new Set();
let outros;
function group_outros() {
    outros = {
        r: 0,
        c: [],
        p: outros // parent group
    };
}
function check_outros() {
    if (!outros.r) {
        run_all(outros.c);
    }
    outros = outros.p;
}
function transition_in(block, local) {
    if (block && block.i) {
        outroing.delete(block);
        block.i(local);
    }
}
function transition_out(block, local, detach, callback) {
    if (block && block.o) {
        if (outroing.has(block))
            return;
        outroing.add(block);
        outros.c.push(() => {
            outroing.delete(block);
            if (callback) {
                if (detach)
                    block.d(1);
                callback();
            }
        });
        block.o(local);
    }
}
const null_transition = { duration: 0 };
function create_in_transition(node, fn, params) {
    let config = fn(node, params);
    let running = false;
    let animation_name;
    let task;
    let uid = 0;
    function cleanup() {
        if (animation_name)
            delete_rule(node, animation_name);
    }
    function go() {
        const { delay = 0, duration = 300, easing = identity, tick = noop$1, css } = config || null_transition;
        if (css)
            animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
        tick(0, 1);
        const start_time = now() + delay;
        const end_time = start_time + duration;
        if (task)
            task.abort();
        running = true;
        add_render_callback(() => dispatch(node, true, 'start'));
        task = loop(now => {
            if (running) {
                if (now >= end_time) {
                    tick(1, 0);
                    dispatch(node, true, 'end');
                    cleanup();
                    return running = false;
                }
                if (now >= start_time) {
                    const t = easing((now - start_time) / duration);
                    tick(t, 1 - t);
                }
            }
            return running;
        });
    }
    let started = false;
    return {
        start() {
            if (started)
                return;
            delete_rule(node);
            if (is_function(config)) {
                config = config();
                wait().then(go);
            }
            else {
                go();
            }
        },
        invalidate() {
            started = false;
        },
        end() {
            if (running) {
                cleanup();
                running = false;
            }
        }
    };
}
function create_out_transition(node, fn, params) {
    let config = fn(node, params);
    let running = true;
    let animation_name;
    const group = outros;
    group.r += 1;
    function go() {
        const { delay = 0, duration = 300, easing = identity, tick = noop$1, css } = config || null_transition;
        if (css)
            animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
        const start_time = now() + delay;
        const end_time = start_time + duration;
        add_render_callback(() => dispatch(node, false, 'start'));
        loop(now => {
            if (running) {
                if (now >= end_time) {
                    tick(0, 1);
                    dispatch(node, false, 'end');
                    if (!--group.r) {
                        // this will result in `end()` being called,
                        // so we don't need to clean up here
                        run_all(group.c);
                    }
                    return false;
                }
                if (now >= start_time) {
                    const t = easing((now - start_time) / duration);
                    tick(1 - t, t);
                }
            }
            return running;
        });
    }
    if (is_function(config)) {
        wait().then(() => {
            // @ts-ignore
            config = config();
            go();
        });
    }
    else {
        go();
    }
    return {
        end(reset) {
            if (reset && config.tick) {
                config.tick(1, 0);
            }
            if (running) {
                if (animation_name)
                    delete_rule(node, animation_name);
                running = false;
            }
        }
    };
}
function create_bidirectional_transition(node, fn, params, intro) {
    let config = fn(node, params);
    let t = intro ? 0 : 1;
    let running_program = null;
    let pending_program = null;
    let animation_name = null;
    function clear_animation() {
        if (animation_name)
            delete_rule(node, animation_name);
    }
    function init(program, duration) {
        const d = program.b - t;
        duration *= Math.abs(d);
        return {
            a: t,
            b: program.b,
            d,
            duration,
            start: program.start,
            end: program.start + duration,
            group: program.group
        };
    }
    function go(b) {
        const { delay = 0, duration = 300, easing = identity, tick = noop$1, css } = config || null_transition;
        const program = {
            start: now() + delay,
            b
        };
        if (!b) {
            // @ts-ignore todo: improve typings
            program.group = outros;
            outros.r += 1;
        }
        if (running_program || pending_program) {
            pending_program = program;
        }
        else {
            // if this is an intro, and there's a delay, we need to do
            // an initial tick and/or apply CSS animation immediately
            if (css) {
                clear_animation();
                animation_name = create_rule(node, t, b, duration, delay, easing, css);
            }
            if (b)
                tick(0, 1);
            running_program = init(program, duration);
            add_render_callback(() => dispatch(node, b, 'start'));
            loop(now => {
                if (pending_program && now > pending_program.start) {
                    running_program = init(pending_program, duration);
                    pending_program = null;
                    dispatch(node, running_program.b, 'start');
                    if (css) {
                        clear_animation();
                        animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                    }
                }
                if (running_program) {
                    if (now >= running_program.end) {
                        tick(t = running_program.b, 1 - t);
                        dispatch(node, running_program.b, 'end');
                        if (!pending_program) {
                            // we're done
                            if (running_program.b) {
                                // intro — we can tidy up immediately
                                clear_animation();
                            }
                            else {
                                // outro — needs to be coordinated
                                if (!--running_program.group.r)
                                    run_all(running_program.group.c);
                            }
                        }
                        running_program = null;
                    }
                    else if (now >= running_program.start) {
                        const p = now - running_program.start;
                        t = running_program.a + running_program.d * easing(p / running_program.duration);
                        tick(t, 1 - t);
                    }
                }
                return !!(running_program || pending_program);
            });
        }
    }
    return {
        run(b) {
            if (is_function(config)) {
                wait().then(() => {
                    // @ts-ignore
                    config = config();
                    go(b);
                });
            }
            else {
                go(b);
            }
        },
        end() {
            clear_animation();
            running_program = pending_program = null;
        }
    };
}

function handle_promise(promise, info) {
    const token = info.token = {};
    function update(type, index, key, value) {
        if (info.token !== token)
            return;
        info.resolved = value;
        let child_ctx = info.ctx;
        if (key !== undefined) {
            child_ctx = child_ctx.slice();
            child_ctx[key] = value;
        }
        const block = type && (info.current = type)(child_ctx);
        let needs_flush = false;
        if (info.block) {
            if (info.blocks) {
                info.blocks.forEach((block, i) => {
                    if (i !== index && block) {
                        group_outros();
                        transition_out(block, 1, 1, () => {
                            if (info.blocks[i] === block) {
                                info.blocks[i] = null;
                            }
                        });
                        check_outros();
                    }
                });
            }
            else {
                info.block.d(1);
            }
            block.c();
            transition_in(block, 1);
            block.m(info.mount(), info.anchor);
            needs_flush = true;
        }
        info.block = block;
        if (info.blocks)
            info.blocks[index] = block;
        if (needs_flush) {
            flush();
        }
    }
    if (is_promise(promise)) {
        const current_component = get_current_component();
        promise.then(value => {
            set_current_component(current_component);
            update(info.then, 1, info.value, value);
            set_current_component(null);
        }, error => {
            set_current_component(current_component);
            update(info.catch, 2, info.error, error);
            set_current_component(null);
            if (!info.hasCatch) {
                throw error;
            }
        });
        // if we previously had a then/catch block, destroy it
        if (info.current !== info.pending) {
            update(info.pending, 0);
            return true;
        }
    }
    else {
        if (info.current !== info.then) {
            update(info.then, 1, info.value, promise);
            return true;
        }
        info.resolved = promise;
    }
}
function update_await_block_branch(info, ctx, dirty) {
    const child_ctx = ctx.slice();
    const { resolved } = info;
    if (info.current === info.then) {
        child_ctx[info.value] = resolved;
    }
    if (info.current === info.catch) {
        child_ctx[info.error] = resolved;
    }
    info.block.p(child_ctx, dirty);
}

const globals = (typeof window !== 'undefined'
    ? window
    : typeof globalThis !== 'undefined'
        ? globalThis
        : global);

function destroy_block(block, lookup) {
    block.d(1);
    lookup.delete(block.key);
}
function outro_and_destroy_block(block, lookup) {
    transition_out(block, 1, 1, () => {
        lookup.delete(block.key);
    });
}
function fix_and_destroy_block(block, lookup) {
    block.f();
    destroy_block(block, lookup);
}
function fix_and_outro_and_destroy_block(block, lookup) {
    block.f();
    outro_and_destroy_block(block, lookup);
}
function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
    let o = old_blocks.length;
    let n = list.length;
    let i = o;
    const old_indexes = {};
    while (i--)
        old_indexes[old_blocks[i].key] = i;
    const new_blocks = [];
    const new_lookup = new Map();
    const deltas = new Map();
    i = n;
    while (i--) {
        const child_ctx = get_context(ctx, list, i);
        const key = get_key(child_ctx);
        let block = lookup.get(key);
        if (!block) {
            block = create_each_block(key, child_ctx);
            block.c();
        }
        else if (dynamic) {
            block.p(child_ctx, dirty);
        }
        new_lookup.set(key, new_blocks[i] = block);
        if (key in old_indexes)
            deltas.set(key, Math.abs(i - old_indexes[key]));
    }
    const will_move = new Set();
    const did_move = new Set();
    function insert(block) {
        transition_in(block, 1);
        block.m(node, next);
        lookup.set(block.key, block);
        next = block.first;
        n--;
    }
    while (o && n) {
        const new_block = new_blocks[n - 1];
        const old_block = old_blocks[o - 1];
        const new_key = new_block.key;
        const old_key = old_block.key;
        if (new_block === old_block) {
            // do nothing
            next = new_block.first;
            o--;
            n--;
        }
        else if (!new_lookup.has(old_key)) {
            // remove old block
            destroy(old_block, lookup);
            o--;
        }
        else if (!lookup.has(new_key) || will_move.has(new_key)) {
            insert(new_block);
        }
        else if (did_move.has(old_key)) {
            o--;
        }
        else if (deltas.get(new_key) > deltas.get(old_key)) {
            did_move.add(new_key);
            insert(new_block);
        }
        else {
            will_move.add(old_key);
            o--;
        }
    }
    while (o--) {
        const old_block = old_blocks[o];
        if (!new_lookup.has(old_block.key))
            destroy(old_block, lookup);
    }
    while (n)
        insert(new_blocks[n - 1]);
    return new_blocks;
}
function validate_each_keys(ctx, list, get_context, get_key) {
    const keys = new Set();
    for (let i = 0; i < list.length; i++) {
        const key = get_key(get_context(ctx, list, i));
        if (keys.has(key)) {
            throw new Error('Cannot have duplicate keys in a keyed each');
        }
        keys.add(key);
    }
}

function get_spread_update(levels, updates) {
    const update = {};
    const to_null_out = {};
    const accounted_for = { $$scope: 1 };
    let i = levels.length;
    while (i--) {
        const o = levels[i];
        const n = updates[i];
        if (n) {
            for (const key in o) {
                if (!(key in n))
                    to_null_out[key] = 1;
            }
            for (const key in n) {
                if (!accounted_for[key]) {
                    update[key] = n[key];
                    accounted_for[key] = 1;
                }
            }
            levels[i] = n;
        }
        else {
            for (const key in o) {
                accounted_for[key] = 1;
            }
        }
    }
    for (const key in to_null_out) {
        if (!(key in update))
            update[key] = undefined;
    }
    return update;
}
function get_spread_object(spread_props) {
    return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
}

// source: https://html.spec.whatwg.org/multipage/indices.html
const boolean_attributes = new Set([
    'allowfullscreen',
    'allowpaymentrequest',
    'async',
    'autofocus',
    'autoplay',
    'checked',
    'controls',
    'default',
    'defer',
    'disabled',
    'formnovalidate',
    'hidden',
    'ismap',
    'loop',
    'multiple',
    'muted',
    'nomodule',
    'novalidate',
    'open',
    'playsinline',
    'readonly',
    'required',
    'reversed',
    'selected'
]);

const invalid_attribute_name_character = /[\s'">/=\u{FDD0}-\u{FDEF}\u{FFFE}\u{FFFF}\u{1FFFE}\u{1FFFF}\u{2FFFE}\u{2FFFF}\u{3FFFE}\u{3FFFF}\u{4FFFE}\u{4FFFF}\u{5FFFE}\u{5FFFF}\u{6FFFE}\u{6FFFF}\u{7FFFE}\u{7FFFF}\u{8FFFE}\u{8FFFF}\u{9FFFE}\u{9FFFF}\u{AFFFE}\u{AFFFF}\u{BFFFE}\u{BFFFF}\u{CFFFE}\u{CFFFF}\u{DFFFE}\u{DFFFF}\u{EFFFE}\u{EFFFF}\u{FFFFE}\u{FFFFF}\u{10FFFE}\u{10FFFF}]/u;
// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
// https://infra.spec.whatwg.org/#noncharacter
function spread(args, classes_to_add) {
    const attributes = Object.assign({}, ...args);
    if (classes_to_add) {
        if (attributes.class == null) {
            attributes.class = classes_to_add;
        }
        else {
            attributes.class += ' ' + classes_to_add;
        }
    }
    let str = '';
    Object.keys(attributes).forEach(name => {
        if (invalid_attribute_name_character.test(name))
            return;
        const value = attributes[name];
        if (value === true)
            str += ' ' + name;
        else if (boolean_attributes.has(name.toLowerCase())) {
            if (value)
                str += ' ' + name;
        }
        else if (value != null) {
            str += ` ${name}="${String(value).replace(/"/g, '&#34;').replace(/'/g, '&#39;')}"`;
        }
    });
    return str;
}
const escaped = {
    '"': '&quot;',
    "'": '&#39;',
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
};
function escape(html) {
    return String(html).replace(/["'&<>]/g, match => escaped[match]);
}
function each(items, fn) {
    let str = '';
    for (let i = 0; i < items.length; i += 1) {
        str += fn(items[i], i);
    }
    return str;
}
const missing_component = {
    $$render: () => ''
};
function validate_component(component, name) {
    if (!component || !component.$$render) {
        if (name === 'svelte:component')
            name += ' this={...}';
        throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
    }
    return component;
}
function debug(file, line, column, values) {
    console.log(`{@debug} ${file ? file + ' ' : ''}(${line}:${column})`); // eslint-disable-line no-console
    console.log(values); // eslint-disable-line no-console
    return '';
}
let on_destroy;
function create_ssr_component(fn) {
    function $$render(result, props, bindings, slots, context) {
        const parent_component = current_component;
        const $$ = {
            on_destroy,
            context: new Map(parent_component ? parent_component.$$.context : context || []),
            // these will be immediately discarded
            on_mount: [],
            before_update: [],
            after_update: [],
            callbacks: blank_object()
        };
        set_current_component({ $$ });
        const html = fn(result, props, bindings, slots);
        set_current_component(parent_component);
        return html;
    }
    return {
        render: (props = {}, { $$slots = {}, context = new Map() } = {}) => {
            on_destroy = [];
            const result = { title: '', head: '', css: new Set() };
            const html = $$render(result, props, {}, $$slots, context);
            run_all(on_destroy);
            return {
                html,
                css: {
                    code: Array.from(result.css).map(css => css.code).join('\n'),
                    map: null // TODO
                },
                head: result.title + result.head
            };
        },
        $$render
    };
}
function add_attribute(name, value, boolean) {
    if (value == null || (boolean && !value))
        return '';
    return ` ${name}${value === true ? '' : `=${typeof value === 'string' ? JSON.stringify(escape(value)) : `"${value}"`}`}`;
}
function add_classes(classes) {
    return classes ? ` class="${classes}"` : '';
}

function bind(component, name, callback) {
    const index = component.$$.props[name];
    if (index !== undefined) {
        component.$$.bound[index] = callback;
        callback(component.$$.ctx[index]);
    }
}
function create_component(block) {
    block && block.c();
}
function claim_component(block, parent_nodes) {
    block && block.l(parent_nodes);
}
function mount_component(component, target, anchor, customElement) {
    const { fragment, on_mount, on_destroy, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    if (!customElement) {
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
    }
    after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
        run_all($$.on_destroy);
        $$.fragment && $$.fragment.d(detaching);
        // TODO null out other refs, including component.$$ (but need to
        // preserve final state?)
        $$.on_destroy = $$.fragment = null;
        $$.ctx = [];
    }
}
function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
        dirty_components.push(component);
        schedule_update();
        component.$$.dirty.fill(0);
    }
    component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
}
function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const $$ = component.$$ = {
        fragment: null,
        ctx: null,
        // state
        props,
        update: noop$1,
        not_equal,
        bound: blank_object(),
        // lifecycle
        on_mount: [],
        on_destroy: [],
        on_disconnect: [],
        before_update: [],
        after_update: [],
        context: new Map(parent_component ? parent_component.$$.context : options.context || []),
        // everything else
        callbacks: blank_object(),
        dirty,
        skip_bound: false
    };
    let ready = false;
    $$.ctx = instance
        ? instance(component, options.props || {}, (i, ret, ...rest) => {
            const value = rest.length ? rest[0] : ret;
            if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                if (!$$.skip_bound && $$.bound[i])
                    $$.bound[i](value);
                if (ready)
                    make_dirty(component, i);
            }
            return ret;
        })
        : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    // `false` as a special case of no DOM component
    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
    if (options.target) {
        if (options.hydrate) {
            const nodes = children(options.target);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.l(nodes);
            nodes.forEach(detach);
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.c();
        }
        if (options.intro)
            transition_in(component.$$.fragment);
        mount_component(component, options.target, options.anchor, options.customElement);
        flush();
    }
    set_current_component(parent_component);
}
let SvelteElement;
if (typeof HTMLElement === 'function') {
    SvelteElement = class extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
        }
        connectedCallback() {
            const { on_mount } = this.$$;
            this.$$.on_disconnect = on_mount.map(run).filter(is_function);
            // @ts-ignore todo: improve typings
            for (const key in this.$$.slotted) {
                // @ts-ignore todo: improve typings
                this.appendChild(this.$$.slotted[key]);
            }
        }
        attributeChangedCallback(attr, _oldValue, newValue) {
            this[attr] = newValue;
        }
        disconnectedCallback() {
            run_all(this.$$.on_disconnect);
        }
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop$1;
        }
        $on(type, callback) {
            // TODO should this delegate to addEventListener?
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    };
}
/**
 * Base class for Svelte components. Used when dev=false.
 */
class SvelteComponent {
    $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop$1;
    }
    $on(type, callback) {
        const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
        callbacks.push(callback);
        return () => {
            const index = callbacks.indexOf(callback);
            if (index !== -1)
                callbacks.splice(index, 1);
        };
    }
    $set($$props) {
        if (this.$$set && !is_empty($$props)) {
            this.$$.skip_bound = true;
            this.$$set($$props);
            this.$$.skip_bound = false;
        }
    }
}

function dispatch_dev(type, detail) {
    document.dispatchEvent(custom_event(type, Object.assign({ version: '3.38.2' }, detail)));
}
function append_dev(target, node) {
    dispatch_dev('SvelteDOMInsert', { target, node });
    append(target, node);
}
function insert_dev(target, node, anchor) {
    dispatch_dev('SvelteDOMInsert', { target, node, anchor });
    insert(target, node, anchor);
}
function detach_dev(node) {
    dispatch_dev('SvelteDOMRemove', { node });
    detach(node);
}
function detach_between_dev(before, after) {
    while (before.nextSibling && before.nextSibling !== after) {
        detach_dev(before.nextSibling);
    }
}
function detach_before_dev(after) {
    while (after.previousSibling) {
        detach_dev(after.previousSibling);
    }
}
function detach_after_dev(before) {
    while (before.nextSibling) {
        detach_dev(before.nextSibling);
    }
}
function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
    const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
    if (has_prevent_default)
        modifiers.push('preventDefault');
    if (has_stop_propagation)
        modifiers.push('stopPropagation');
    dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
    const dispose = listen(node, event, handler, options);
    return () => {
        dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
        dispose();
    };
}
function attr_dev(node, attribute, value) {
    attr(node, attribute, value);
    if (value == null)
        dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
    else
        dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
}
function prop_dev(node, property, value) {
    node[property] = value;
    dispatch_dev('SvelteDOMSetProperty', { node, property, value });
}
function dataset_dev(node, property, value) {
    node.dataset[property] = value;
    dispatch_dev('SvelteDOMSetDataset', { node, property, value });
}
function set_data_dev(text, data) {
    data = '' + data;
    if (text.wholeText === data)
        return;
    dispatch_dev('SvelteDOMSetData', { node: text, data });
    text.data = data;
}
function validate_each_argument(arg) {
    if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
        let msg = '{#each} only iterates over array-like objects.';
        if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
            msg += ' You can use a spread to convert this iterable into an array.';
        }
        throw new Error(msg);
    }
}
function validate_slots(name, slot, keys) {
    for (const slot_key of Object.keys(slot)) {
        if (!~keys.indexOf(slot_key)) {
            console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
        }
    }
}
/**
 * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
 */
class SvelteComponentDev extends SvelteComponent {
    constructor(options) {
        if (!options || (!options.target && !options.$$inline)) {
            throw new Error("'target' is a required option");
        }
        super();
    }
    $destroy() {
        super.$destroy();
        this.$destroy = () => {
            console.warn('Component was already destroyed'); // eslint-disable-line no-console
        };
    }
    $capture_state() { }
    $inject_state() { }
}
/**
 * Base class to create strongly typed Svelte components.
 * This only exists for typing purposes and should be used in `.d.ts` files.
 *
 * ### Example:
 *
 * You have component library on npm called `component-library`, from which
 * you export a component called `MyComponent`. For Svelte+TypeScript users,
 * you want to provide typings. Therefore you create a `index.d.ts`:
 * ```ts
 * import { SvelteComponentTyped } from "svelte";
 * export class MyComponent extends SvelteComponentTyped<{foo: string}> {}
 * ```
 * Typing this makes it possible for IDEs like VS Code with the Svelte extension
 * to provide intellisense and to use the component like this in a Svelte file
 * with TypeScript:
 * ```svelte
 * <script lang="ts">
 * 	import { MyComponent } from "component-library";
 * </script>
 * <MyComponent foo={'bar'} />
 * ```
 *
 * #### Why not make this part of `SvelteComponent(Dev)`?
 * Because
 * ```ts
 * class ASubclassOfSvelteComponent extends SvelteComponent<{foo: string}> {}
 * const component: typeof SvelteComponent = ASubclassOfSvelteComponent;
 * ```
 * will throw a type error, so we need to seperate the more strictly typed class.
 */
class SvelteComponentTyped extends SvelteComponentDev {
    constructor(options) {
        super(options);
    }
}
function loop_guard(timeout) {
    const start = Date.now();
    return () => {
        if (Date.now() - start > timeout) {
            throw new Error('Infinite loop detected');
        }
    };
}

/**
 * @typedef {Object} WrappedComponent Object returned by the `wrap` method
 * @property {SvelteComponent} component - Component to load (this is always asynchronous)
 * @property {RoutePrecondition[]} [conditions] - Route pre-conditions to validate
 * @property {Object} [props] - Optional dictionary of static props
 * @property {Object} [userData] - Optional user data dictionary
 * @property {bool} _sveltesparouter - Internal flag; always set to true
 */

/**
 * @callback AsyncSvelteComponent
 * @returns {Promise<SvelteComponent>} Returns a Promise that resolves with a Svelte component
 */

/**
 * @callback RoutePrecondition
 * @param {RouteDetail} detail - Route detail object
 * @returns {boolean|Promise<boolean>} If the callback returns a false-y value, it's interpreted as the precondition failed, so it aborts loading the component (and won't process other pre-condition callbacks)
 */

/**
 * @typedef {Object} WrapOptions Options object for the call to `wrap`
 * @property {SvelteComponent} [component] - Svelte component to load (this is incompatible with `asyncComponent`)
 * @property {AsyncSvelteComponent} [asyncComponent] - Function that returns a Promise that fulfills with a Svelte component (e.g. `{asyncComponent: () => import('Foo.svelte')}`)
 * @property {SvelteComponent} [loadingComponent] - Svelte component to be displayed while the async route is loading (as a placeholder); when unset or false-y, no component is shown while component
 * @property {object} [loadingParams] - Optional dictionary passed to the `loadingComponent` component as params (for an exported prop called `params`)
 * @property {object} [userData] - Optional object that will be passed to events such as `routeLoading`, `routeLoaded`, `conditionsFailed`
 * @property {object} [props] - Optional key-value dictionary of static props that will be passed to the component. The props are expanded with {...props}, so the key in the dictionary becomes the name of the prop.
 * @property {RoutePrecondition[]|RoutePrecondition} [conditions] - Route pre-conditions to add, which will be executed in order
 */

/**
 * Wraps a component to enable multiple capabilities:
 * 1. Using dynamically-imported component, with (e.g. `{asyncComponent: () => import('Foo.svelte')}`), which also allows bundlers to do code-splitting.
 * 2. Adding route pre-conditions (e.g. `{conditions: [...]}`)
 * 3. Adding static props that are passed to the component
 * 4. Adding custom userData, which is passed to route events (e.g. route loaded events) or to route pre-conditions (e.g. `{userData: {foo: 'bar}}`)
 * 
 * @param {WrapOptions} args - Arguments object
 * @returns {WrappedComponent} Wrapped component
 */
function wrap$1(args) {
    if (!args) {
        throw Error('Parameter args is required')
    }

    // We need to have one and only one of component and asyncComponent
    // This does a "XNOR"
    if (!args.component == !args.asyncComponent) {
        throw Error('One and only one of component and asyncComponent is required')
    }

    // If the component is not async, wrap it into a function returning a Promise
    if (args.component) {
        args.asyncComponent = () => Promise.resolve(args.component);
    }

    // Parameter asyncComponent and each item of conditions must be functions
    if (typeof args.asyncComponent != 'function') {
        throw Error('Parameter asyncComponent must be a function')
    }
    if (args.conditions) {
        // Ensure it's an array
        if (!Array.isArray(args.conditions)) {
            args.conditions = [args.conditions];
        }
        for (let i = 0; i < args.conditions.length; i++) {
            if (!args.conditions[i] || typeof args.conditions[i] != 'function') {
                throw Error('Invalid parameter conditions[' + i + ']')
            }
        }
    }

    // Check if we have a placeholder component
    if (args.loadingComponent) {
        args.asyncComponent.loading = args.loadingComponent;
        args.asyncComponent.loadingParams = args.loadingParams || undefined;
    }

    // Returns an object that contains all the functions to execute too
    // The _sveltesparouter flag is to confirm the object was created by this router
    const obj = {
        component: args.asyncComponent,
        userData: args.userData,
        conditions: (args.conditions && args.conditions.length) ? args.conditions : undefined,
        props: (args.props && Object.keys(args.props).length) ? args.props : {},
        _sveltesparouter: true
    };

    return obj
}

const subscriber_queue = [];
/**
 * Creates a `Readable` store that allows reading by subscription.
 * @param value initial value
 * @param {StartStopNotifier}start start and stop notifications for subscriptions
 */
function readable(value, start) {
    return {
        subscribe: writable(value, start).subscribe
    };
}
/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 * @param {*=}value initial value
 * @param {StartStopNotifier=}start start and stop notifications for subscriptions
 */
function writable(value, start = noop$1) {
    let stop;
    const subscribers = [];
    function set(new_value) {
        if (safe_not_equal(value, new_value)) {
            value = new_value;
            if (stop) { // store is ready
                const run_queue = !subscriber_queue.length;
                for (let i = 0; i < subscribers.length; i += 1) {
                    const s = subscribers[i];
                    s[1]();
                    subscriber_queue.push(s, value);
                }
                if (run_queue) {
                    for (let i = 0; i < subscriber_queue.length; i += 2) {
                        subscriber_queue[i][0](subscriber_queue[i + 1]);
                    }
                    subscriber_queue.length = 0;
                }
            }
        }
    }
    function update(fn) {
        set(fn(value));
    }
    function subscribe(run, invalidate = noop$1) {
        const subscriber = [run, invalidate];
        subscribers.push(subscriber);
        if (subscribers.length === 1) {
            stop = start(set) || noop$1;
        }
        run(value);
        return () => {
            const index = subscribers.indexOf(subscriber);
            if (index !== -1) {
                subscribers.splice(index, 1);
            }
            if (subscribers.length === 0) {
                stop();
                stop = null;
            }
        };
    }
    return { set, update, subscribe };
}
function derived(stores, fn, initial_value) {
    const single = !Array.isArray(stores);
    const stores_array = single
        ? [stores]
        : stores;
    const auto = fn.length < 2;
    return readable(initial_value, (set) => {
        let inited = false;
        const values = [];
        let pending = 0;
        let cleanup = noop$1;
        const sync = () => {
            if (pending) {
                return;
            }
            cleanup();
            const result = fn(single ? values[0] : values, set);
            if (auto) {
                set(result);
            }
            else {
                cleanup = is_function(result) ? result : noop$1;
            }
        };
        const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
            values[i] = value;
            pending &= ~(1 << i);
            if (inited) {
                sync();
            }
        }, () => {
            pending |= (1 << i);
        }));
        inited = true;
        sync();
        return function stop() {
            run_all(unsubscribers);
            cleanup();
        };
    });
}

function regexparam (str, loose) {
	if (str instanceof RegExp) return { keys:false, pattern:str };
	var c, o, tmp, ext, keys=[], pattern='', arr = str.split('/');
	arr[0] || arr.shift();

	while (tmp = arr.shift()) {
		c = tmp[0];
		if (c === '*') {
			keys.push('wild');
			pattern += '/(.*)';
		} else if (c === ':') {
			o = tmp.indexOf('?', 1);
			ext = tmp.indexOf('.', 1);
			keys.push( tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length) );
			pattern += !!~o && !~ext ? '(?:/([^/]+?))?' : '/([^/]+?)';
			if (!!~ext) pattern += (!!~o ? '?' : '') + '\\' + tmp.substring(ext);
		} else {
			pattern += '/' + tmp;
		}
	}

	return {
		keys: keys,
		pattern: new RegExp('^' + pattern + (loose ? '(?=$|\/)' : '\/?$'), 'i')
	};
}

/* node_modules\svelte-spa-router\Router.svelte generated by Svelte v3.38.2 */

const { Error: Error_1, Object: Object_1$3, console: console_1 } = globals;
const file$k = "node_modules\\svelte-spa-router\\Router.svelte";

// (209:0) {:else}
function create_else_block$3(ctx) {
	let switch_instance;
	let switch_instance_anchor;
	let current;
	const switch_instance_spread_levels = [/*props*/ ctx[2]];
	var switch_value = /*component*/ ctx[0];

	function switch_props(ctx) {
		let switch_instance_props = {};

		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
		}

		return {
			props: switch_instance_props,
			$$inline: true
		};
	}

	if (switch_value) {
		switch_instance = new switch_value(switch_props(ctx));
		switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
	}

	const block = {
		c: function create() {
			if (switch_instance) create_component(switch_instance.$$.fragment);
			switch_instance_anchor = empty();
		},
		m: function mount(target, anchor) {
			if (switch_instance) {
				mount_component(switch_instance, target, anchor);
			}

			insert_dev(target, switch_instance_anchor, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const switch_instance_changes = (dirty & /*props*/ 4)
			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*props*/ ctx[2])])
			: {};

			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
				if (switch_instance) {
					group_outros();
					const old_component = switch_instance;

					transition_out(old_component.$$.fragment, 1, 0, () => {
						destroy_component(old_component, 1);
					});

					check_outros();
				}

				if (switch_value) {
					switch_instance = new switch_value(switch_props(ctx));
					switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
					create_component(switch_instance.$$.fragment);
					transition_in(switch_instance.$$.fragment, 1);
					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
				} else {
					switch_instance = null;
				}
			} else if (switch_value) {
				switch_instance.$set(switch_instance_changes);
			}
		},
		i: function intro(local) {
			if (current) return;
			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(switch_instance_anchor);
			if (switch_instance) destroy_component(switch_instance, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block$3.name,
		type: "else",
		source: "(209:0) {:else}",
		ctx
	});

	return block;
}

// (202:0) {#if componentParams}
function create_if_block$7(ctx) {
	let switch_instance;
	let switch_instance_anchor;
	let current;
	const switch_instance_spread_levels = [{ params: /*componentParams*/ ctx[1] }, /*props*/ ctx[2]];
	var switch_value = /*component*/ ctx[0];

	function switch_props(ctx) {
		let switch_instance_props = {};

		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
		}

		return {
			props: switch_instance_props,
			$$inline: true
		};
	}

	if (switch_value) {
		switch_instance = new switch_value(switch_props(ctx));
		switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
	}

	const block = {
		c: function create() {
			if (switch_instance) create_component(switch_instance.$$.fragment);
			switch_instance_anchor = empty();
		},
		m: function mount(target, anchor) {
			if (switch_instance) {
				mount_component(switch_instance, target, anchor);
			}

			insert_dev(target, switch_instance_anchor, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const switch_instance_changes = (dirty & /*componentParams, props*/ 6)
			? get_spread_update(switch_instance_spread_levels, [
					dirty & /*componentParams*/ 2 && { params: /*componentParams*/ ctx[1] },
					dirty & /*props*/ 4 && get_spread_object(/*props*/ ctx[2])
				])
			: {};

			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
				if (switch_instance) {
					group_outros();
					const old_component = switch_instance;

					transition_out(old_component.$$.fragment, 1, 0, () => {
						destroy_component(old_component, 1);
					});

					check_outros();
				}

				if (switch_value) {
					switch_instance = new switch_value(switch_props(ctx));
					switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
					create_component(switch_instance.$$.fragment);
					transition_in(switch_instance.$$.fragment, 1);
					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
				} else {
					switch_instance = null;
				}
			} else if (switch_value) {
				switch_instance.$set(switch_instance_changes);
			}
		},
		i: function intro(local) {
			if (current) return;
			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(switch_instance_anchor);
			if (switch_instance) destroy_component(switch_instance, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$7.name,
		type: "if",
		source: "(202:0) {#if componentParams}",
		ctx
	});

	return block;
}

function create_fragment$k(ctx) {
	let current_block_type_index;
	let if_block;
	let if_block_anchor;
	let current;
	const if_block_creators = [create_if_block$7, create_else_block$3];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*componentParams*/ ctx[1]) return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx, -1);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	const block = {
		c: function create() {
			if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if_blocks[current_block_type_index].m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx, dirty);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block = if_blocks[current_block_type_index];

				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
				} else {
					if_block.p(ctx, dirty);
				}

				transition_in(if_block, 1);
				if_block.m(if_block_anchor.parentNode, if_block_anchor);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if_blocks[current_block_type_index].d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$k.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function wrap(component, userData, ...conditions) {
	// Use the new wrap method and show a deprecation warning
	// eslint-disable-next-line no-console
	console.warn("Method `wrap` from `svelte-spa-router` is deprecated and will be removed in a future version. Please use `svelte-spa-router/wrap` instead. See http://bit.ly/svelte-spa-router-upgrading");

	return wrap$1({ component, userData, conditions });
}

/**
 * @typedef {Object} Location
 * @property {string} location - Location (page/view), for example `/book`
 * @property {string} [querystring] - Querystring from the hash, as a string not parsed
 */
/**
 * Returns the current location from the hash.
 *
 * @returns {Location} Location object
 * @private
 */
function getLocation() {
	const hashPosition = window.location.href.indexOf("#/");

	let location = hashPosition > -1
	? window.location.href.substr(hashPosition + 1)
	: "/";

	// Check if there's a querystring
	const qsPosition = location.indexOf("?");

	let querystring = "";

	if (qsPosition > -1) {
		querystring = location.substr(qsPosition + 1);
		location = location.substr(0, qsPosition);
	}

	return { location, querystring };
}

const loc = readable(null, // eslint-disable-next-line prefer-arrow-callback
function start(set) {
	set(getLocation());

	const update = () => {
		set(getLocation());
	};

	window.addEventListener("hashchange", update, false);

	return function stop() {
		window.removeEventListener("hashchange", update, false);
	};
});

const location = derived(loc, $loc => $loc.location);
const querystring = derived(loc, $loc => $loc.querystring);

async function push(location) {
	if (!location || location.length < 1 || location.charAt(0) != "/" && location.indexOf("#/") !== 0) {
		throw Error("Invalid parameter location");
	}

	// Execute this code when the current call stack is complete
	await tick();

	// Note: this will include scroll state in history even when restoreScrollState is false
	history.replaceState(
		{
			scrollX: window.scrollX,
			scrollY: window.scrollY
		},
		undefined,
		undefined
	);

	window.location.hash = (location.charAt(0) == "#" ? "" : "#") + location;
}

async function pop() {
	// Execute this code when the current call stack is complete
	await tick();

	window.history.back();
}

async function replace(location) {
	if (!location || location.length < 1 || location.charAt(0) != "/" && location.indexOf("#/") !== 0) {
		throw Error("Invalid parameter location");
	}

	// Execute this code when the current call stack is complete
	await tick();

	const dest = (location.charAt(0) == "#" ? "" : "#") + location;

	try {
		window.history.replaceState(undefined, undefined, dest);
	} catch(e) {
		// eslint-disable-next-line no-console
		console.warn("Caught exception while replacing the current page. If you're running this in the Svelte REPL, please note that the `replace` method might not work in this environment.");
	}

	// The method above doesn't trigger the hashchange event, so let's do that manually
	window.dispatchEvent(new Event("hashchange"));
}

function link(node, hrefVar) {
	// Only apply to <a> tags
	if (!node || !node.tagName || node.tagName.toLowerCase() != "a") {
		throw Error("Action \"link\" can only be used with <a> tags");
	}

	updateLink(node, hrefVar || node.getAttribute("href"));

	return {
		update(updated) {
			updateLink(node, updated);
		}
	};
}

// Internal function used by the link function
function updateLink(node, href) {
	// Destination must start with '/'
	if (!href || href.length < 1 || href.charAt(0) != "/") {
		throw Error("Invalid value for \"href\" attribute: " + href);
	}

	// Add # to the href attribute
	node.setAttribute("href", "#" + href);

	node.addEventListener("click", scrollstateHistoryHandler);
}

/**
 * The handler attached to an anchor tag responsible for updating the
 * current history state with the current scroll state
 *
 * @param {HTMLElementEventMap} event - an onclick event attached to an anchor tag
 */
function scrollstateHistoryHandler(event) {
	// Prevent default anchor onclick behaviour
	event.preventDefault();

	const href = event.currentTarget.getAttribute("href");

	// Setting the url (3rd arg) to href will break clicking for reasons, so don't try to do that
	history.replaceState(
		{
			scrollX: window.scrollX,
			scrollY: window.scrollY
		},
		undefined,
		undefined
	);

	// This will force an update as desired, but this time our scroll state will be attached
	window.location.hash = href;
}

function instance$k($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("Router", slots, []);
	let { routes = {} } = $$props;
	let { prefix = "" } = $$props;
	let { restoreScrollState = false } = $$props;

	/**
 * Container for a route: path, component
 */
	class RouteItem {
		/**
 * Initializes the object and creates a regular expression from the path, using regexparam.
 *
 * @param {string} path - Path to the route (must start with '/' or '*')
 * @param {SvelteComponent|WrappedComponent} component - Svelte component for the route, optionally wrapped
 */
		constructor(path, component) {
			if (!component || typeof component != "function" && (typeof component != "object" || component._sveltesparouter !== true)) {
				throw Error("Invalid component object");
			}

			// Path must be a regular or expression, or a string starting with '/' or '*'
			if (!path || typeof path == "string" && (path.length < 1 || path.charAt(0) != "/" && path.charAt(0) != "*") || typeof path == "object" && !(path instanceof RegExp)) {
				throw Error("Invalid value for \"path\" argument - strings must start with / or *");
			}

			const { pattern, keys } = regexparam(path);
			this.path = path;

			// Check if the component is wrapped and we have conditions
			if (typeof component == "object" && component._sveltesparouter === true) {
				this.component = component.component;
				this.conditions = component.conditions || [];
				this.userData = component.userData;
				this.props = component.props || {};
			} else {
				// Convert the component to a function that returns a Promise, to normalize it
				this.component = () => Promise.resolve(component);

				this.conditions = [];
				this.props = {};
			}

			this._pattern = pattern;
			this._keys = keys;
		}

		/**
 * Checks if `path` matches the current route.
 * If there's a match, will return the list of parameters from the URL (if any).
 * In case of no match, the method will return `null`.
 *
 * @param {string} path - Path to test
 * @returns {null|Object.<string, string>} List of paramters from the URL if there's a match, or `null` otherwise.
 */
		match(path) {
			// If there's a prefix, check if it matches the start of the path.
			// If not, bail early, else remove it before we run the matching.
			if (prefix) {
				if (typeof prefix == "string") {
					if (path.startsWith(prefix)) {
						path = path.substr(prefix.length) || "/";
					} else {
						return null;
					}
				} else if (prefix instanceof RegExp) {
					const match = path.match(prefix);

					if (match && match[0]) {
						path = path.substr(match[0].length) || "/";
					} else {
						return null;
					}
				}
			}

			// Check if the pattern matches
			const matches = this._pattern.exec(path);

			if (matches === null) {
				return null;
			}

			// If the input was a regular expression, this._keys would be false, so return matches as is
			if (this._keys === false) {
				return matches;
			}

			const out = {};
			let i = 0;

			while (i < this._keys.length) {
				// In the match parameters, URL-decode all values
				try {
					out[this._keys[i]] = decodeURIComponent(matches[i + 1] || "") || null;
				} catch(e) {
					out[this._keys[i]] = null;
				}

				i++;
			}

			return out;
		}

		/**
 * Dictionary with route details passed to the pre-conditions functions, as well as the `routeLoading`, `routeLoaded` and `conditionsFailed` events
 * @typedef {Object} RouteDetail
 * @property {string|RegExp} route - Route matched as defined in the route definition (could be a string or a reguar expression object)
 * @property {string} location - Location path
 * @property {string} querystring - Querystring from the hash
 * @property {object} [userData] - Custom data passed by the user
 * @property {SvelteComponent} [component] - Svelte component (only in `routeLoaded` events)
 * @property {string} [name] - Name of the Svelte component (only in `routeLoaded` events)
 */
		/**
 * Executes all conditions (if any) to control whether the route can be shown. Conditions are executed in the order they are defined, and if a condition fails, the following ones aren't executed.
 * 
 * @param {RouteDetail} detail - Route detail
 * @returns {bool} Returns true if all the conditions succeeded
 */
		async checkConditions(detail) {
			for (let i = 0; i < this.conditions.length; i++) {
				if (!await this.conditions[i](detail)) {
					return false;
				}
			}

			return true;
		}
	}

	// Set up all routes
	const routesList = [];

	if (routes instanceof Map) {
		// If it's a map, iterate on it right away
		routes.forEach((route, path) => {
			routesList.push(new RouteItem(path, route));
		});
	} else {
		// We have an object, so iterate on its own properties
		Object.keys(routes).forEach(path => {
			routesList.push(new RouteItem(path, routes[path]));
		});
	}

	// Props for the component to render
	let component = null;

	let componentParams = null;
	let props = {};

	// Event dispatcher from Svelte
	const dispatch = createEventDispatcher();

	// Just like dispatch, but executes on the next iteration of the event loop
	async function dispatchNextTick(name, detail) {
		// Execute this code when the current call stack is complete
		await tick();

		dispatch(name, detail);
	}

	// If this is set, then that means we have popped into this var the state of our last scroll position
	let previousScrollState = null;

	if (restoreScrollState) {
		window.addEventListener("popstate", event => {
			// If this event was from our history.replaceState, event.state will contain
			// our scroll history. Otherwise, event.state will be null (like on forward
			// navigation)
			if (event.state && event.state.scrollY) {
				previousScrollState = event.state;
			} else {
				previousScrollState = null;
			}
		});

		afterUpdate(() => {
			// If this exists, then this is a back navigation: restore the scroll position
			if (previousScrollState) {
				window.scrollTo(previousScrollState.scrollX, previousScrollState.scrollY);
			} else {
				// Otherwise this is a forward navigation: scroll to top
				window.scrollTo(0, 0);
			}
		});
	}

	// Always have the latest value of loc
	let lastLoc = null;

	// Current object of the component loaded
	let componentObj = null;

	// Handle hash change events
	// Listen to changes in the $loc store and update the page
	// Do not use the $: syntax because it gets triggered by too many things
	loc.subscribe(async newLoc => {
		lastLoc = newLoc;

		// Find a route matching the location
		let i = 0;

		while (i < routesList.length) {
			const match = routesList[i].match(newLoc.location);

			if (!match) {
				i++;
				continue;
			}

			const detail = {
				route: routesList[i].path,
				location: newLoc.location,
				querystring: newLoc.querystring,
				userData: routesList[i].userData
			};

			// Check if the route can be loaded - if all conditions succeed
			if (!await routesList[i].checkConditions(detail)) {
				// Don't display anything
				$$invalidate(0, component = null);

				componentObj = null;

				// Trigger an event to notify the user, then exit
				dispatchNextTick("conditionsFailed", detail);

				return;
			}

			// Trigger an event to alert that we're loading the route
			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
			dispatchNextTick("routeLoading", Object.assign({}, detail));

			// If there's a component to show while we're loading the route, display it
			const obj = routesList[i].component;

			// Do not replace the component if we're loading the same one as before, to avoid the route being unmounted and re-mounted
			if (componentObj != obj) {
				if (obj.loading) {
					$$invalidate(0, component = obj.loading);
					componentObj = obj;
					$$invalidate(1, componentParams = obj.loadingParams);
					$$invalidate(2, props = {});

					// Trigger the routeLoaded event for the loading component
					// Create a copy of detail so we don't modify the object for the dynamic route (and the dynamic route doesn't modify our object too)
					dispatchNextTick("routeLoaded", Object.assign({}, detail, { component, name: component.name }));
				} else {
					$$invalidate(0, component = null);
					componentObj = null;
				}

				// Invoke the Promise
				const loaded = await obj();

				// Now that we're here, after the promise resolved, check if we still want this component, as the user might have navigated to another page in the meanwhile
				if (newLoc != lastLoc) {
					// Don't update the component, just exit
					return;
				}

				// If there is a "default" property, which is used by async routes, then pick that
				$$invalidate(0, component = loaded && loaded.default || loaded);

				componentObj = obj;
			}

			// Set componentParams only if we have a match, to avoid a warning similar to `<Component> was created with unknown prop 'params'`
			// Of course, this assumes that developers always add a "params" prop when they are expecting parameters
			if (match && typeof match == "object" && Object.keys(match).length) {
				$$invalidate(1, componentParams = match);
			} else {
				$$invalidate(1, componentParams = null);
			}

			// Set static props, if any
			$$invalidate(2, props = routesList[i].props);

			// Dispatch the routeLoaded event then exit
			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
			dispatchNextTick("routeLoaded", Object.assign({}, detail, { component, name: component.name }));

			return;
		}

		// If we're still here, there was no match, so show the empty component
		$$invalidate(0, component = null);

		componentObj = null;
	});

	const writable_props = ["routes", "prefix", "restoreScrollState"];

	Object_1$3.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Router> was created with unknown prop '${key}'`);
	});

	function routeEvent_handler(event) {
		bubble($$self, event);
	}

	function routeEvent_handler_1(event) {
		bubble($$self, event);
	}

	$$self.$$set = $$props => {
		if ("routes" in $$props) $$invalidate(3, routes = $$props.routes);
		if ("prefix" in $$props) $$invalidate(4, prefix = $$props.prefix);
		if ("restoreScrollState" in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
	};

	$$self.$capture_state = () => ({
		readable,
		derived,
		tick,
		_wrap: wrap$1,
		wrap,
		getLocation,
		loc,
		location,
		querystring,
		push,
		pop,
		replace,
		link,
		updateLink,
		scrollstateHistoryHandler,
		createEventDispatcher,
		afterUpdate,
		regexparam,
		routes,
		prefix,
		restoreScrollState,
		RouteItem,
		routesList,
		component,
		componentParams,
		props,
		dispatch,
		dispatchNextTick,
		previousScrollState,
		lastLoc,
		componentObj
	});

	$$self.$inject_state = $$props => {
		if ("routes" in $$props) $$invalidate(3, routes = $$props.routes);
		if ("prefix" in $$props) $$invalidate(4, prefix = $$props.prefix);
		if ("restoreScrollState" in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
		if ("component" in $$props) $$invalidate(0, component = $$props.component);
		if ("componentParams" in $$props) $$invalidate(1, componentParams = $$props.componentParams);
		if ("props" in $$props) $$invalidate(2, props = $$props.props);
		if ("previousScrollState" in $$props) previousScrollState = $$props.previousScrollState;
		if ("lastLoc" in $$props) lastLoc = $$props.lastLoc;
		if ("componentObj" in $$props) componentObj = $$props.componentObj;
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*restoreScrollState*/ 32) {
			// Update history.scrollRestoration depending on restoreScrollState
			$: history.scrollRestoration = restoreScrollState ? "manual" : "auto";
		}
	};

	return [
		component,
		componentParams,
		props,
		routes,
		prefix,
		restoreScrollState,
		routeEvent_handler,
		routeEvent_handler_1
	];
}

class Router extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$k, create_fragment$k, safe_not_equal, {
			routes: 3,
			prefix: 4,
			restoreScrollState: 5
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Router",
			options,
			id: create_fragment$k.name
		});
	}

	get routes() {
		return this.$$.ctx[3];
	}

	set routes(routes) {
		this.$set({ routes });
		flush();
	}

	get prefix() {
		return this.$$.ctx[4];
	}

	set prefix(prefix) {
		this.$set({ prefix });
		flush();
	}

	get restoreScrollState() {
		return this.$$.ctx[5];
	}

	set restoreScrollState(restoreScrollState) {
		this.$set({ restoreScrollState });
		flush();
	}
}

var router = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': Router,
    wrap: wrap,
    loc: loc,
    location: location,
    querystring: querystring,
    push: push,
    pop: pop,
    replace: replace,
    link: link
});

class CloneUtility {
    // yanked from https://stackoverflow.com/a/40294058
    static deep(obj, hash = new WeakMap()) {
        if (Object(obj) !== obj) {
            return obj;
        } // primitives
        if (hash.has(obj)) {
            return hash.get(obj);
        } // cyclic reference
        const result = obj instanceof Set ? new Set(obj) // See note about this!
            : obj instanceof Map ? new Map(Array.from(obj, ([key, val]) => [key, CloneUtility.deep(val, hash)]))
                : obj instanceof Date ? new Date(obj)
                    : obj instanceof RegExp ? new RegExp(obj.source, obj.flags)
                        // ... add here any specific treatment for other classes ...
                        // and finally a catch-all:
                        : obj.constructor ? new obj.constructor()
                            : Object.create(null);
        hash.set(obj, result);
        return Object.assign(result, ...Object.keys(obj).map((key) => ({ [key]: CloneUtility.deep(obj[key], hash) })));
    }
}

class ClientError extends Error {
    constructor(message = 'No message provided, an error with errors?') {
        super(message);
        this.name = this.constructor.name;
        // eslint is drunk
        // eslint-disable-next-line
        Error.captureStackTrace?.(this, this.constructor);
    }
    // like a "from" call, but more ambiguous
    static toError(obj) {
        const clientError = new this();
        clientError.name = obj.name;
        clientError.message = obj.message;
        clientError.stack = obj.stack;
        // @ts-expect-error
        return clientError;
    }
    toPlainObject() {
        return {
            name: this.name,
            message: this.message,
            stack: this.stack,
        };
    }
}

class ValidationError extends ClientError {
    constructor(message) {
        super(`Something happened during validation${message ? `: ${message}` : ''}`);
    }
}

var Modes;
(function (Modes) {
    Modes["START"] = "start";
    Modes["BISECT"] = "bisect";
    Modes["END"] = "end";
})(Modes || (Modes = {}));
class StringUtility {
    ctx;
    static Modes = Modes;
    constructor(ctx) {
        this.ctx = ctx;
    }
    build() {
        return this.ctx;
    }
    newLine(position) {
        return this.insertAt('\n', position);
    }
    br(position) {
        return this.insertAt('<br>', position);
    }
    CRLF(position) {
        return this.insertAt('&#13;&#10;', position);
    }
    splice(start, length, item = '') {
        return `${this.ctx.substr(0, start)}${item}${this.ctx.substr(start + length)}`;
    }
    insertAt(substr, position) {
        return `${this.ctx.substring(this.getModePosition(Modes.START), this.getPosition(position))}${substr}${this.ctx.substring(this.getPosition(position), this.getModePosition(Modes.END))}`;
    }
    splitAt(matcher, eat = false) {
        if (typeof matcher === 'string') {
            matcher = new RegExp(EscapeUtility.escapeRegex(matcher));
        }
        const match = matcher.exec(this.ctx);
        if (match == null) {
            throw new ValidationError(`Tried to split with a matcher ("${matcher.source}") that produced no matches on context ("${this.ctx}")`);
        }
        const position = match.index;
        return [
            this.ctx.substring(this.getModePosition(Modes.START), this.getPosition(position)),
            this.ctx.substring(position + Number(eat && match[0].length), this.getModePosition(Modes.END)),
        ];
    }
    splitAtLast(matcher, eat = false) {
        if (typeof matcher === 'string') {
            matcher = new RegExp(EscapeUtility.escapeRegex(matcher), 'g');
        }
        else {
            matcher = new RegExp(matcher.source, 'g');
        }
        let execResult = null;
        let match = null;
        let position = 0;
        while ((execResult = matcher.exec(this.ctx)) != null) {
            match = execResult;
            position = execResult.index;
        }
        if (match == null) {
            throw new ValidationError(`Tried to split with a matcher ("${matcher.source}") that produced no matches on context ("${this.ctx}")`);
        }
        return [
            this.ctx.substring(this.getModePosition(Modes.START), this.getPosition(position)),
            this.ctx.substring(position + Number(eat && match[0].length), this.getModePosition(Modes.END)),
        ];
    }
    splitAtIndex(position, eat = false) {
        return [
            this.ctx.substring(this.getModePosition(Modes.START), this.getPosition(position)),
            this.ctx.substring(this.getPosition(position) + Number(eat), this.getModePosition(Modes.END)),
        ];
    }
    getPosition(position) {
        switch (typeof position) {
            case 'string':
                return this.getModePosition(position);
            case 'number':
                return position;
            default:
                throw new ValidationError(`position === ${position}`);
        }
    }
    getModePosition(mode) {
        switch (mode) {
            case Modes.START:
                return 0;
            case Modes.END:
                return this.ctx.length;
            case Modes.BISECT:
                return (() => {
                    const ctxParts = this.ctx.split(' ');
                    return this.ctx.indexOf(ctxParts[Math.floor(ctxParts.length / 2)]);
                })();
            default:
                throw new ValidationError(`mode === ${mode}`);
        }
    }
}

class EscapeUtility {
    static escapeRegex(string) {
        return string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    }
    // todo: only escape non alphanumeric
    static escapeHTML(string) {
        return string
            .split('')
            .map((char) => `&#${char.charCodeAt(0)};`)
            .join('');
    }
    static unescapeHTML(string) {
        const regex = /&#(\d?\d{2});/g;
        let match;
        while ((match = regex.exec(string)) != null) {
            const { index } = match;
            const { length } = match[0];
            const charCode = Number(match[1]);
            string = new StringUtility(string)
                .splice(index, length, String.fromCharCode(charCode));
        }
        return string;
    }
    static escapeHTMLCommonEntities(string) {
        return string
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
    static unescapeHTMLCommonEntities(string) {
        return string
            .replace(/&amp[;]?/g, '&')
            .replace(/&lt[;]?/g, '<')
            .replace(/&gt[;]?/g, '>')
            .replace(/&quot[;]?/g, '"')
            .replace(/&#[0]?39[;]?/g, '\'');
    }
}

var LogLevels;
(function (LogLevels) {
    LogLevels[LogLevels["NONE"] = 0] = "NONE";
    LogLevels[LogLevels["ERROR"] = 1] = "ERROR";
    LogLevels[LogLevels["WARN"] = 2] = "WARN";
    LogLevels[LogLevels["INFO"] = 3] = "INFO";
    LogLevels[LogLevels["DEBUG"] = 4] = "DEBUG";
})(LogLevels || (LogLevels = {}));
class LogUtility {
    ctx;
    constructor(ctx) {
        this.ctx = LogUtility.getCtxString(ctx);
    }
    static CURRENT_LOG_LEVEL = LogLevels.INFO;
    static LogLevels = LogLevels;
    static getCtxString(ctx) {
        if (typeof ctx === 'string') {
            return ctx;
        }
        if (ctx == null) {
            if (this.name !== 'LogUtility') {
                return this.name;
            }
            return 'null';
        }
        return ctx.name
            ?? ctx.constructor?.name
            ?? 'null';
    }
    debug(...messages) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        LogUtility.debugWith(this.ctx ?? this, ...messages);
    }
    static debugWith(ctx, ...messages) {
        void LogUtility._({
            data: messages,
            logLevel: LogUtility.LogLevels.DEBUG,
            printFunction: console.log,
            colour: 37,
            ctx,
        });
    }
    log(...messages) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        LogUtility.logWith(this.ctx ?? this, ...messages);
    }
    static logWith(ctx, ...messages) {
        void LogUtility._({
            data: messages,
            logLevel: LogUtility.LogLevels.INFO,
            printFunction: console.log,
            colour: 37,
            ctx,
        });
    }
    error(...messages) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        LogUtility.errorWith(this.ctx ?? this, ...messages);
    }
    static errorWith(ctx, ...messages) {
        void LogUtility._({
            data: messages,
            logLevel: LogUtility.LogLevels.ERROR,
            printFunction: console.error,
            colour: 31,
            ctx,
        });
    }
    warn(...messages) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        LogUtility.warnWith(this.ctx ?? this, ...messages);
    }
    static warnWith(ctx, ...messages) {
        void LogUtility._({
            data: messages,
            logLevel: LogUtility.LogLevels.WARN,
            printFunction: console.warn,
            colour: 33,
            ctx,
        });
    }
    static async _({ data = [''], logLevel = LogUtility.LogLevels.INFO, printFunction = console.log, colour = 0, ctx, }) {
        const message = data
            .map((chunk) => {
            switch (true) {
                case chunk instanceof Error:
                    return chunk?.stack ?? chunk.message;
                case typeof chunk === 'object':
                    try {
                        return JSON.stringify(chunk, undefined, 4);
                    }
                    catch (_) {
                        // fallthrough
                    }
                // eslint-disable-next-line
                default:
                    return chunk?.toString?.() ?? String(chunk);
            }
        })
            .join(' ');
        // get the log level name from 'logLevel' as value (eg. { ...VERBOSE: 4 } → 'VERBOSE')
        const logLevelProperty = Object.keys(this.LogLevels)
            .find(
        // @ts-expect-error obj[string]
        (key) => this.LogLevels[key] === logLevel);
        const currentTime = new Date().toLocaleString();
        const logMessage = `[${currentTime}] [${LogUtility.getCtxString(ctx)}/${logLevelProperty ?? 'null'}]: ${message}`;
        if (logLevel > LogUtility.CURRENT_LOG_LEVEL) {
            return;
        }
        printFunction(`\x1b[${colour}m${logMessage}\x1b[0m`);
    }
    static alias(ctx) {
        const bound = LogUtility.bind(LogUtility, ctx);
        bound.prototype = LogUtility.prototype;
        return bound;
    }
}

class IncorrectUsageError extends ClientError {
    constructor(message) {
        super(`Incorrect usage of item${message ? `: ${message}` : ''}`);
    }
}

class SleepUtility {
    static async sleep(ms = 0) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }
    static sleepSync(ms) {
        try {
            Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 1, ms);
        }
        catch (_) {
            throw new IncorrectUsageError('sleepSync() can only be used in later versions of node & web workers. (not on web main thread!)');
        }
    }
}

class WalkUtility {
    static object(object, callback) {
        if (typeof object !== 'object') {
            return callback(object);
        }
        const keys = Object.keys(object);
        const result = {};
        for (let i = 0, l = keys.length; i < l; ++i) {
            const key = keys[i];
            const value = object[key];
            result[key] = this.object(value, callback);
        }
        return result;
    }
    static void(object, callback) {
        if (typeof object !== 'object') {
            callback(object);
            return;
        }
        const keys = Object.keys(object);
        for (let i = 0, l = keys.length; i < l; ++i) {
            const key = keys[i];
            const value = object[key];
            this.object(value, callback);
        }
    }
    static mirror(from, to) {
        const keys = Object.keys(from);
        for (let i = 0, l = keys.length; i < l; ++i) {
            const key = keys[i];
            const fromValue = from[key];
            if (fromValue === null
                || typeof fromValue !== 'object') {
                to[key] = fromValue;
                continue;
            }
            if (to[key] === null
                || typeof to[key] !== 'object') {
                to[key] = Number.isNaN(Number(key)) ? {} : [];
            }
            this.mirror(fromValue, to[key]);
        }
    }
}

class Item {
    static from(options) {
        const instance = new this();
        // Object.keys(options).forEach((optionKey) => {
        // 	// @ts-expect-error obj[string]
        // 	instance[optionKey] = options[optionKey];
        // });
        WalkUtility.mirror(options, instance);
        return instance;
    }
    toString() {
        return JSON.stringify(this);
    }
    ;
}
class Factory {
}

class CompatiblerResultItem extends Item {
    common = {
        BaseSupportVersion: false,
    };
    rendering = {
        MediaRecorder: false,
        MediaStream: false,
        SharedArrayBuffer: false,
    };
}

class JSONParseError extends ClientError {
    constructor(message) {
        super(`Failed to parse JSON${message ? `: ${message}` : ''}`);
    }
}

class NetworkError extends ClientError {
    constructor(message) {
        super(`A network error was encountered${message ? `: ${message}` : ''}`);
    }
}

class ParseError extends ClientError {
    static LINE_LENGTH = 80;
    constructor(parser, message = '', expected = '') {
        const lineNumber = Math.floor(parser.cursor / ParseError.LINE_LENGTH);
        const charNumber = parser.cursor % ParseError.LINE_LENGTH;
        const splitterRegex = new RegExp(`(.|[\r\n]){1,${ParseError.LINE_LENGTH}}`, 'g');
        // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
        const lines = parser.chunk.match(splitterRegex) ?? [''];
        lines.splice(lineNumber + 1, 0, `${' '.repeat(charNumber)}↑`, `${' '.repeat(charNumber)}[here]`);
        super(`
${expected ? `Expected:
	${expected}
` : ''}At:
    ${lines.join('\n    ')}
${message ?? ''}`);
    }
}

class UnexpectedValueError extends ClientError {
    constructor(message) {
        super(`An unexpected value was encountered${message ? `: ${message}` : ''}`);
    }
}

class UnreachableError extends ClientError {
    constructor(message) {
        super(`Somehow, you're in an unreachable part of code${message ? `: ${message}` : ''}`);
    }
}

class UnsupportedOperationError extends ClientError {
    constructor(message) {
        super(`Attempted to execute an unsupported operation${message ? `: ${message}` : ''}`);
    }
}

var english = {
    common: {
        info: {
            YES: 'Yes',
            NO: 'No',
            OK: 'Ok',
            CONFIRM: 'Confirm',
            CONTINUE: 'Continue',
            CANCEL: 'Cancel',
            EXIT: 'Exit',
            EATEN_COOKIES: 'burp!',
            general: {
                NAME: '',
            },
        },
        warn: {},
        errors: {
            NO_MESSAGE_PROVIDED: 'No message provided',
            INCORRECT_ARGUMENT: 'Incorrect argument(s) provided',
            INCORRECT_USAGE: 'Incorrect usage of item',
            IO: 'Something went wrong while trying to write or read a file',
            JSON_PARSE: 'Something went wrong while trying to parse JSON data',
            PUBLISH: 'Something went wrong while trying to publish to Instagram',
            NETWORK: 'Something went wrong while trying to make a network request',
            TIME: 'Time makes no sense',
            UNSUPPORTED_OPERATION: 'Unsupported operation',
            INCOMPATIBLE: 'Environment is incompatible',
            UNEXPECTED_VALUE: 'An unexpected value was encountered',
            UNREACHABLE: 'Somehow, you\'re in an unreachable part of code',
        },
        ask: {},
        routes: {
            info: {
                HOME: 'Home',
            },
            warn: {},
            error: {},
            ask: {},
        },
    },
    core: {
        common: {
            info: {},
            warn: {},
            error: {},
            ask: {},
        },
        renderottie: {
            info: {
                FILE_PREFIX: 'The hard work of renderer #',
            },
            warn: {},
            error: {},
            ask: {},
        },
    },
    ui: {
        common: {
            info: {},
            warn: {
                NO_CALLBACK: 'No callback prop provided',
                GENERIC: 'This is awkward... If you see this, something very wrong has probably happened',
            },
            error: {},
            ask: {},
        },
        scenes: {
            common: {
                info: {},
                warn: {
                    EMPTY_SCENE: 'This is awkward... There\'s nothing here',
                },
                error: {},
                ask: {},
            },
        },
    },
    __boiler: {
        info: {},
        warn: {},
        error: {},
        ask: {},
    },
};

var strings = (() => {
    switch (globalThis?.navigator?.language?.substr(0, 2)) {
        case 'en':
        default:
            return english;
    }
})();

class IncompatibleError extends ClientError {
    constructor(message) {
        super(`${strings.common.errors.INCOMPATIBLE}${message ? `:\n\n${message}` : ''}`);
    }
}

// eslint-disable-next-line import/named
class Compatibler {
    static test() {
        return CompatiblerResultItem.from({
            // use functions to calculate final result
            // because getters aren't enumerable
            common: {
                BaseSupportVersion: 'noModule' in document.createElement('script'),
            },
            rendering: {
                MediaRecorder: (() => {
                    try {
                        // @ts-expect-error
                        new MediaRecorder(new MediaStream(), {
                            mimeType: 'video/webm; codecs=vp9',
                        });
                        return true;
                    }
                    catch (err) {
                        return false;
                    }
                })(),
                MediaStream: typeof MediaStream !== 'undefined',
                SharedArrayBuffer: typeof SharedArrayBuffer !== 'undefined',
            },
        });
    }
    static throw(result) {
        const reason = Object.keys(result)
            .map((categoryKey) => {
            // @ts-expect-error obj[string]
            const categoryValue = result[categoryKey];
            const prefix = `[${categoryKey}]: `;
            const unsupportedItems = Object.keys(categoryValue)
                .map((categoryValueKey) => (!categoryValue[categoryValueKey]
                ? categoryValueKey
                : undefined));
            if (unsupportedItems.join('') === '') {
                return '';
            }
            const unsupportedItemsResult = [];
            unsupportedItems.forEach((unsupportedItem) => (unsupportedItem != null
                && unsupportedItemsResult.push(`${prefix}${unsupportedItem}\n`)));
            return unsupportedItemsResult.join('');
        })
            .join('\n');
        if (reason.trim().length === 0) {
            return;
        }
        throw new IncompatibleError(reason);
    }
}

class ForUtility {
    static addToArrayPrototype() {
        // non-standard, used by this to keep track of the singleton
        if (Array.prototype.__forUtilitySingletonExecuted) {
            return;
        }
        const methods = {
            fastEach(callback, ctx) {
                const workingArray = this;
                if (ctx == null) {
                    for (let i = 0, l = workingArray.length; i < l; ++i) {
                        callback(workingArray[i], i);
                    }
                    return;
                }
                for (let i = 0, l = workingArray.length; i < l; ++i) {
                    callback.call(ctx || this, workingArray[i], i);
                }
            },
            async forAwait(callback, ctx = null) {
                const workingArray = this;
                for (let i = 0, l = workingArray.length; i < l; ++i) {
                    await callback.call(ctx || this, workingArray[i], i);
                }
            },
            getAll(callback, ctx = null) {
                const workingArray = this;
                const returnValues = [];
                for (let i = 0, l = workingArray.length; i < l; ++i) {
                    if (callback.call(ctx || this, workingArray[i], i)) {
                        returnValues.push(workingArray[i]);
                    }
                }
                return returnValues;
            },
            getSome(callback, ctx = null) {
                const workingArray = this;
                for (let i = 0, l = workingArray.length; i < l; ++i) {
                    if (callback.call(ctx || this, workingArray[i], i)) {
                        return workingArray[i];
                    }
                }
                return null;
            },
        };
        Object.keys(methods).forEach((key) => {
            // @ts-expect-error obj[string]
            Array.prototype[key] = methods[key];
        });
        Array.prototype.__forUtilitySingletonExecuted = true;
    }
}

/**
 * https://github.com/gre/bezier-easing
 * BezierEasing - use bezier curve for transition easing function
 * by Gaëtan Renaudeau 2014 - 2015 – MIT License
 */
class BezierUtility {
    mX1;
    mY1;
    mX2;
    mY2;
    // These values are established by empiricism with tests (tradeoff: performance VS precision)
    static NEWTON_ITERATIONS = 4;
    static NEWTON_MIN_SLOPE = 0.001;
    static SUBDIVISION_PRECISION = 0.0000001;
    static SUBDIVISION_MAX_ITERATIONS = 10;
    static kSplineTableSize = 11;
    static kSampleStepSize = 1.0 / (BezierUtility.kSplineTableSize - 1.0);
    static sampleValues = (typeof Float32Array === 'function')
        ? new Float32Array(BezierUtility.kSplineTableSize)
        : new Array(BezierUtility.kSplineTableSize);
    constructor(mX1, mY1, mX2, mY2) {
        this.mX1 = mX1;
        this.mY1 = mY1;
        this.mX2 = mX2;
        this.mY2 = mY2;
        if (!(mX1 >= 0 && mX1 <= 1 && mX2 >= 0 && mX2 <= 1)) {
            throw new Error('bezier x values must be in [0, 1] range');
        }
        // LinearEasing
        if (mX1 === mY1 && mX2 === mY2) {
            return this;
        }
        // Precompute samples table
        for (let i = 0; i < BezierUtility.kSplineTableSize; ++i) {
            BezierUtility.sampleValues[i] = BezierUtility.calcBezier(i * BezierUtility.kSampleStepSize, mX1, mX2);
        }
    }
    at(value) {
        // LinearEasing
        if (this.mX1 === this.mY1
            && this.mX2 === this.mY2) {
            return value;
        }
        // Because JavaScript number are imprecise, we should guarantee the extremes are right.
        if (value === 0 || value === 1) {
            return value;
        }
        // LinearEasing
        if (this.mX1 === this.mY1 && this.mX2 === this.mY2) {
            return value;
        }
        return BezierUtility.calcBezier(BezierUtility.getTForX(value, this.mX1, this.mX2), this.mY1, this.mY2);
    }
    static getTForX(aX, mX1, mX2) {
        let intervalStart = 0.0;
        let currentSample = 1;
        const lastSample = BezierUtility.kSplineTableSize - 1;
        for (; currentSample !== lastSample && BezierUtility.sampleValues[currentSample] <= aX; ++currentSample) {
            intervalStart += BezierUtility.kSampleStepSize;
        }
        --currentSample;
        // Interpolate to provide an initial guess for t
        const dist = (aX - BezierUtility.sampleValues[currentSample])
            / (BezierUtility.sampleValues[currentSample + 1]
                - BezierUtility.sampleValues[currentSample]);
        const guessForT = intervalStart + dist * BezierUtility.kSampleStepSize;
        const initialSlope = BezierUtility.getSlope(guessForT, mX1, mX2);
        if (initialSlope >= BezierUtility.NEWTON_MIN_SLOPE) {
            return BezierUtility.newtonRaphsonIterate(aX, guessForT, mX1, mX2);
        }
        if (initialSlope === 0.0) {
            return guessForT;
        }
        return BezierUtility.binarySubdivide(aX, intervalStart, intervalStart + BezierUtility.kSampleStepSize, mX1, mX2);
    }
    static A(aA1, aA2) {
        return 1.0 - 3.0 * aA2 + 3.0 * aA1;
    }
    static B(aA1, aA2) {
        return 3.0 * aA2 - 6.0 * aA1;
    }
    static C(aA1) {
        return 3.0 * aA1;
    }
    // Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
    static calcBezier(aT, aA1, aA2) {
        return ((BezierUtility.A(aA1, aA2)
            * aT
            + BezierUtility.B(aA1, aA2))
            * aT
            + BezierUtility.C(aA1))
            * aT;
    }
    // Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
    static getSlope(aT, aA1, aA2) {
        return (3.0
            * BezierUtility.A(aA1, aA2)
            * aT
            * aT)
            + (2.0
                * BezierUtility.B(aA1, aA2)
                * aT
                + BezierUtility.C(aA1));
    }
    static binarySubdivide(aX, aA, aB, mX1, mX2) {
        let currentX;
        let currentT;
        let i = 0;
        do {
            currentT = aA + (aB - aA) / 2.0;
            currentX = BezierUtility.calcBezier(currentT, mX1, mX2) - aX;
            if (currentX > 0.0) {
                aB = currentT;
            }
            else {
                aA = currentT;
            }
        } while (Math.abs(currentX) > BezierUtility.SUBDIVISION_PRECISION
            && ++i < BezierUtility.SUBDIVISION_MAX_ITERATIONS);
        return currentT;
    }
    static newtonRaphsonIterate(aX, aGuessT, mX1, mX2) {
        for (let i = 0; i < BezierUtility.NEWTON_ITERATIONS; ++i) {
            const currentSlope = BezierUtility.getSlope(aGuessT, mX1, mX2);
            if (currentSlope === 0.0) {
                return aGuessT;
            }
            const currentX = BezierUtility.calcBezier(aGuessT, mX1, mX2) - aX;
            aGuessT -= currentX / currentSlope;
        }
        return aGuessT;
    }
}

// "taken" from: https://medium.com/@karenmarkosyan/how-to-manage-promises-into-dynamic-queue-with-vanilla-javascript-9d0d1f8d4df5
class PromiseQueueUtility {
    static queue = [];
    static workingOnPromise = false;
    static enqueue(asyncFunction) {
        return new Promise((resolve, reject) => {
            this.queue.push({
                asyncFunction,
                resolve,
                reject,
            });
            this.dequeue();
        });
    }
    static dequeue() {
        if (this.workingOnPromise) {
            return false;
        }
        const item = this.queue.shift();
        if (!item) {
            return false;
        }
        try {
            this.workingOnPromise = true;
            item.asyncFunction()
                .then((value) => {
                this.workingOnPromise = false;
                item.resolve(value);
                this.dequeue();
            })
                .catch((err) => {
                this.workingOnPromise = false;
                item.reject(err);
                this.dequeue();
            });
        }
        catch (err) {
            this.workingOnPromise = false;
            item.reject(err);
            this.dequeue();
        }
        return true;
    }
}

class $Factory {
    static create(objectToCreateFrom = {}) {
        ForUtility.addToArrayPrototype();
        const object = {
            addClass(classNames) {
                switch (classNames.constructor) {
                    case String:
                        classNames.split(' ').fastEach((className) => {
                            this.classList.add(className);
                        });
                        break;
                    case Array:
                        classNames.fastEach((className) => {
                            this.addClass(className);
                        });
                        break;
                    default:
                }
                return this;
            },
            removeClass(classNames) {
                switch (classNames.constructor) {
                    case String:
                        classNames.split(' ').fastEach((className) => {
                            this.classList.remove(className);
                        });
                        break;
                    case Array:
                        classNames.fastEach((className) => {
                            this.removeClass(className);
                        });
                        break;
                    default:
                }
                return this;
            },
            toggleClass(classNames) {
                switch (classNames.constructor) {
                    case String:
                        classNames.split(' ').fastEach((className) => {
                            this.classList.toggle(className);
                        });
                        break;
                    case Array:
                        classNames.fastEach((className) => {
                            this.toggleClass(className);
                        });
                        break;
                    default:
                }
                return this;
            },
            css(property, value, options = {}) {
                // handle when the options are passed into the value argument
                if (value
                    && value.constructor === Object) {
                    return this.css(property, undefined, value);
                }
                let processedValue;
                let returnedValues;
                let propertyHasParentheses = false;
                let stackable = false;
                const unitlessProperties = [
                    'opacity',
                    'gridRowStart',
                    'gridRowEnd',
                    'columns',
                    'columnCount',
                ];
                const stackableProperties = [
                    {
                        name: 'transition',
                        hasParentheses: false,
                    },
                    {
                        name: 'transform',
                        hasParentheses: true,
                    },
                ];
                switch (property.constructor) {
                    case String:
                        // determine if the property is a stackable one
                        stackableProperties.fastEach(({ name, hasParentheses, }) => {
                            // return if the 'property' is not in 'stacakbleProperties'
                            if (name !== property) {
                                return;
                            }
                            stackable = true;
                            propertyHasParentheses = hasParentheses;
                        });
                        if (value === undefined) {
                            // the value of the property should be returned instead of set
                            // @ts-expect-error obj[string]
                            processedValue = this.style[property];
                            if (options.computed) {
                                // @ts-expect-error obj[string]
                                processedValue = getValueWithoutUnit(getComputedStyle(this)[property]);
                            }
                            if (stackable
                                && options.returnAsObject) {
                                processedValue = getAttributesFromValueString(processedValue, propertyHasParentheses);
                            }
                            return processedValue;
                        }
                        // the value of the property should be set instead of returned
                        processedValue = value;
                        // if the value string is missing a unit, add px
                        if (unitlessProperties.includes(property) === false) {
                            processedValue = getValueWithUnit(value);
                        }
                        if (stackable) {
                            // create attribute objects from the value strings
                            const oldAttributes = getAttributesFromValueString(
                            // @ts-expect-error obj[string]
                            this.style[property], propertyHasParentheses);
                            const newAttributes = getAttributesFromValueString(processedValue, propertyHasParentheses);
                            const processedAttributes = oldAttributes;
                            Object.assign(processedAttributes, newAttributes);
                            processedValue = getValueStringFromAttributes(processedAttributes, propertyHasParentheses);
                        }
                        // @ts-expect-error obj[string]
                        this.style[property] = processedValue;
                        return this;
                    case Array:
                        if (value === undefined) {
                            returnedValues = {};
                            property.fastEach((item) => {
                                // @ts-expect-error obj[string]
                                returnedValues[item] = this.css(item);
                            });
                            return returnedValues;
                        }
                        property.fastEach((item, i) => {
                            // @ts-expect-error string[number]
                            this.css(item, value[i]);
                        });
                        return this;
                    case Object:
                        returnedValues = {};
                        Object.keys(property).fastEach((key) => {
                            // @ts-expect-error obj[string]
                            const returnedValue = this.css(key, property[key]);
                            if (returnedValue === this) {
                                return;
                            }
                            // @ts-expect-error obj[string]
                            returnedValues[key] = returnedValue;
                        });
                        return returnedValues === {} ? this : returnedValues;
                    default:
                        return this.style;
                }
                function formatValueString(valueString) {
                    return valueString
                        .toLowerCase()
                        .replace(/\s/g, '');
                }
                function getValueWithoutUnit(valueWithUnit) {
                    if (valueWithUnit.includes('px') === false) {
                        return valueWithUnit;
                    }
                    return valueWithUnit.replace(/px/g, '');
                }
                function getValueWithUnit(valueWithoutUnit) {
                    if (valueWithoutUnit == null) {
                        return valueWithoutUnit;
                    }
                    if (typeof valueWithoutUnit === 'number'
                        || Number.isNaN(Number(valueWithoutUnit)) === false) {
                        return `${valueWithoutUnit}px`;
                    }
                    return valueWithoutUnit;
                }
                function getAttributesFromValueString(valueStringWithAttributes, hasParentheses) {
                    let valueArrayWithAttributes;
                    let attributeKeys;
                    let attributeValues;
                    if (hasParentheses) {
                        // split between ')' and remove ')' in the meantime
                        valueArrayWithAttributes = formatValueString(valueStringWithAttributes)
                            .split(')');
                        // remove everything inside parentheses
                        // regex is slower than native functions https://jsben.ch/8GY5K
                        attributeKeys = valueArrayWithAttributes
                            .map((attribute) => attribute
                            .substr(0, attribute.indexOf('('))
                            .trim());
                        // remove everything before and including '('
                        // ')' was removed when we split it in 'valueArrayWithAttributes'
                        attributeValues = valueArrayWithAttributes
                            .map((attribute) => attribute
                            .substr(attribute.indexOf('(') + 1));
                    }
                    else {
                        // split between and remove every ','
                        valueArrayWithAttributes = formatValueString(valueStringWithAttributes)
                            .split(',');
                        // get the substring before anything that isn't an alphabet
                        attributeKeys = valueArrayWithAttributes.map((attribute) => attribute
                            .substring(0, attribute.search(/[^a-zA-Z]/)));
                        // get the substring starting at the first character that isn't an alphabet
                        attributeValues = valueArrayWithAttributes.map((attribute) => attribute
                            .substr(attribute.search(/[^a-zA-Z]/)));
                    }
                    const attributeObject = {};
                    attributeKeys.fastEach((key, i) => {
                        if (!key) {
                            return;
                        }
                        attributeObject[key] = attributeValues[i];
                    });
                    return attributeObject;
                }
                function getValueStringFromAttributes(attributes, hasParentheses) {
                    let valueArray;
                    let valueString;
                    if (hasParentheses) {
                        valueArray = Object.keys(attributes).map((attributeKey) => `${attributeKey}(${attributes[attributeKey]})`);
                        valueString = valueArray.join('');
                    }
                    else {
                        valueArray = Object.keys(attributes).map((attributeKey) => `${attributeKey}${attributes[attributeKey]}`);
                        valueString = valueArray.join(',');
                    }
                    return valueString;
                }
            },
            on(eventsStr, ...options) {
                const events = eventsStr.split(' ');
                let selector;
                let handler;
                let eventOptions = {};
                options.fastEach((option) => {
                    switch (option.constructor) {
                        case String:
                            if (selector == null) {
                                selector = option;
                            }
                            break;
                        case Function:
                            if (handler == null) {
                                handler = option;
                            }
                            break;
                        case Object:
                            if (Object.keys(eventOptions).length === 0) {
                                eventOptions = option;
                            }
                            break;
                        default:
                            break;
                    }
                });
                events.fastEach((eventStr) => {
                    this.addEventListener(eventStr, (event) => {
                        const processedEvent = event;
                        if (!event) {
                            return handler(event);
                        }
                        const { target } = processedEvent;
                        if (!target) {
                            return null;
                        }
                        if (selector !== null
                            && !(target.matches?.(selector))) {
                            return null;
                        }
                        return handler.call(target, processedEvent);
                    }, eventOptions);
                });
                return this;
            },
            off(eventsStr, ...options) {
                const events = eventsStr.split(' ');
                let selector;
                let handler;
                options.fastEach((option, i) => {
                    switch (option.constructor) {
                        case String:
                            if (selector != null) {
                                break;
                            }
                            selector = option;
                            break;
                        case Function:
                            if (i !== options.length - 1) {
                                break;
                            }
                            handler = option;
                            break;
                        default:
                            break;
                    }
                });
                events.fastEach((eventStr) => {
                    this.removeEventListener(eventStr, (event) => {
                        const processedEvent = event;
                        if (!event) {
                            return handler(event);
                        }
                        const { target } = processedEvent;
                        if (!target) {
                            return null;
                        }
                        if (selector !== null
                            && !(target.matches?.(selector))) {
                            return null;
                        }
                        return handler.call(target, processedEvent);
                    });
                });
                return this;
            },
            async getJSON(url, callback) {
                const response = await fetch(url);
                return callback ? callback(await response.json()) : response.json();
            },
            $,
            $$,
            // workaround to keep the type
            ...{},
        };
        // ...spread doesn't work directly on dom objects apparently
        Object.assign(objectToCreateFrom, object);
        return objectToCreateFrom;
    }
}

class NotJQuery {
    // the object that is applied to can be just some random object
    $(objectToCreateFrom = {}) {
        switch (true) {
            case this
                && this.constructor === Object
                && objectToCreateFrom.constructor === String:
                return $Factory.create(Object.values(this)
                    .find((node) => node.matches?.(objectToCreateFrom)));
            case objectToCreateFrom === undefined:
                return $Factory.create({});
            case objectToCreateFrom === null:
                throw new Error('Cannot create from null!');
            case objectToCreateFrom.constructor === String: {
                const queryResult = document.querySelector(objectToCreateFrom);
                return queryResult && $Factory.create(queryResult);
            }
            default:
                return $Factory.create(objectToCreateFrom);
        }
    }
    $$(objectToCreateFrom = {}) {
        switch (true) {
            case this
                && this.constructor === Object
                && objectToCreateFrom.constructor === String:
                return Object.values(this)
                    .getAll((node) => node.matches?.(objectToCreateFrom))
                    .map((elem) => $Factory.create(elem));
            case objectToCreateFrom === undefined:
                return [$Factory.create({})];
            case objectToCreateFrom === null:
                throw new Error('Cannot create from null!');
            case objectToCreateFrom.constructor === String:
                return Array.from(document.querySelectorAll(objectToCreateFrom)).map((elem) => $Factory.create(elem));
            default:
                return [$Factory.create(objectToCreateFrom)];
        }
    }
}
const { $, $$, } = new NotJQuery();

class WindowUtility {
    static cache = {};
    static invalidateCache() {
        this.cache = {};
    }
    static refresh() {
        this.invalidateCache();
        this.cache = {
            inner: this.inner,
            viewport: this.viewport,
            client: this.client,
            isMobile: this.isMobile,
        };
    }
    static vh(amount) {
        return (this.viewport.height / 100) * amount;
    }
    static vw(amount) {
        return (this.viewport.width / 100) * amount;
    }
    static px(amount) {
        return amount * window.devicePixelRatio;
    }
    static get client() {
        if (this.cache?.client?.height
            || this.cache?.client?.width) {
            return this.cache.client;
        }
        return {
            height: document.documentElement.clientHeight,
            width: document.documentElement.clientWidth,
            max: Math.max(document.documentElement.clientHeight, document.documentElement.clientWidth),
            min: Math.min(document.documentElement.clientHeight, document.documentElement.clientWidth),
        };
    }
    static get inner() {
        if (this.cache?.inner?.height
            || this.cache?.inner?.width) {
            return this.cache.inner;
        }
        return {
            height: window.innerHeight,
            width: window.innerWidth,
            max: Math.max(window.innerHeight, window.innerWidth),
            min: Math.min(window.innerHeight, window.innerWidth),
        };
    }
    static get viewport() {
        if (this.cache?.viewport?.height
            || this.cache?.viewport?.width) {
            return this.cache.viewport;
        }
        const viewportCalibrator = $(document.createElement('div'));
        viewportCalibrator.css({
            height: '100vh',
            width: '100vw',
            visibility: 'hidden',
        });
        document.body.appendChild(viewportCalibrator);
        const height = viewportCalibrator.offsetHeight;
        const width = viewportCalibrator.offsetWidth;
        document.body.removeChild(viewportCalibrator);
        return {
            height,
            width,
            max: Math.max(height, width),
            min: Math.min(height, width),
        };
    }
    static get isMobile() {
        if (this.cache?.isMobile) {
            return this.cache.isMobile;
        }
        const isMobile = window.matchMedia('(pointer: coarse)').matches
            || window.matchMedia('(pointer: cnone)').matches;
        this.cache.isMobile = isMobile;
        return isMobile;
    }
}
if (typeof window !== String(undefined)) {
    $(window).on('resize', () => {
        WindowUtility.refresh();
    });
}

class RandomUtility {
    static int(length = 16) {
        return Number(new Array(length)
            .fill(null)
            .map(() => String(Math.floor(Math.min(Math.random() * 10, 9))))
            .join(''));
    }
    static string(length = 16, charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') {
        let result = '';
        const { length: charsetLength } = charset;
        for (let i = 0; i < length; i++) {
            result += charset.charAt(Math.floor(Math.random() * charsetLength));
        }
        return result;
    }
}

/* eslint-disable dot-notation */
class CSSUtility {
    static parse(value) {
        switch (true) {
            case value == null:
                return '0px';
            // @ts-expect-error string[number]
            case value[0] === '-'
                // @ts-expect-error string[number]
                && value[1] === '-':
                return `var(${value})`;
            case this.isNumber(value):
                return `${value}px`;
            default:
                return value;
        }
    }
    static unparse(value, ctx) {
        switch (true) {
            case value == null:
                return 0;
            case this.isNumber(value):
                return Number(value);
            case value[value.length - 1] === '%':
                this.assertCtx(ctx);
                // it is very much not null because of the assert
                return ctx.clientWidth * (Number.parseFloat(value) / 100);
            case this.isSingularValue(value, 'px'):
                return Number.parseFloat(value);
            case this.isSingularValue(value, 'vh'):
                return WindowUtility.viewport.height;
            case this.isSingularValue(value, 'vw'):
                return WindowUtility.viewport.width;
            case this.isSingularValue(value, 'vmax'):
                return Math.max(WindowUtility.viewport.height, WindowUtility.viewport.width);
            case this.isSingularValue(value, 'vmin'):
                return Math.min(WindowUtility.viewport.height, WindowUtility.viewport.width);
            case value.indexOf('var(--') === 0:
                this.assertCtx(ctx);
                return Number(this.getVariable(value, ctx));
            default:
                this.assertCtx(ctx);
                return this.getComputed(value, ctx);
        }
    }
    static getVariable(variable, ctx = document.documentElement) {
        return getComputedStyle(ctx)
            .getPropertyValue(variable
            .replace(/^var\(/, '')
            .replace(/\)$/, ''))
            .trim();
    }
    static isSingularValue(value, suffix) {
        return this.isNumber(value.replace(suffix, ''));
    }
    static getComputed(value, ctx) {
        // @ts-expect-error obj[string]
        ctx.style['x'] = value;
        // @ts-expect-error obj[string]
        const result = Number.parseFloat(getComputedStyle(ctx)['x']);
        // @ts-expect-error obj[string]
        ctx.style['x'] = null;
        if (Number.isNaN(result)) {
            throw new UnexpectedValueError('result === NaN');
        }
        return result;
    }
    static assertCtx(ctx) {
        if (ctx != null) {
            return;
        }
        throw new IncorrectUsageError(`ctx === ${ctx}`);
    }
    static isNumber(value) {
        return !Number.isNaN(Number(value));
    }
}

// copied from svelte's implementation
class Store {
    value;
    subscribers = [];
    subscriberQueue = [];
    stop = null;
    constructor(value) {
        this.value = value;
    }
    static neq(a, b) {
        // @ts-expect-error
        // eslint-disable-next-line no-self-compare, eqeqeq, no-negated-condition
        return a != a ? b == b : a !== b || (a && typeof a === 'object') || typeof a === 'function';
    }
    set(newValue) {
        if (Store.neq(this.value, newValue)) {
            this.value = newValue;
            this.trigger();
        }
    }
    trigger() {
        if (!this.stop) {
            return;
        }
        // store is ready
        const runQueue = !this.subscriberQueue.length;
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < this.subscribers.length; i += 1) {
            const s = this.subscribers[i];
            s[1]();
            // @ts-expect-error don't event know why
            this.subscriberQueue.push(s, this.value);
        }
        if (runQueue) {
            for (let i = 0; i < this.subscriberQueue.length; i += 2) {
                // @ts-expect-error
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                this.subscriberQueue[i][0](this.subscriberQueue[i + 1]);
            }
            this.subscriberQueue.length = 0;
        }
    }
    update(fn) {
        this.set(fn(this.value));
    }
    subscribe(run, invalidate = () => { }) {
        const subscriber = [run, invalidate];
        this.subscribers.push(subscriber);
        if (this.subscribers.length === 1) {
            this.stop = () => { };
        }
        run(this.value);
        return () => {
            this.unsubscribe(subscriber);
        };
    }
    unsubscribe(subscriber) {
        const index = this.subscribers.indexOf(subscriber);
        if (index !== -1) {
            this.subscribers.splice(index, 1);
        }
        if (this.subscribers.length === 0) {
            this.stop?.();
            this.stop = null;
        }
    }
}

var ResponsiveClasses;
(function (ResponsiveClasses) {
    ResponsiveClasses["MOBILE"] = "mobile";
    ResponsiveClasses["TABLET"] = "tablet";
    ResponsiveClasses["POTATO"] = "potato";
    ResponsiveClasses["DESKTOP"] = "desktop";
})(ResponsiveClasses || (ResponsiveClasses = {}));
var ResponsiveBreakpoints;
(function (ResponsiveBreakpoints) {
    ResponsiveBreakpoints[ResponsiveBreakpoints["MOBILE"] = 0] = "MOBILE";
    ResponsiveBreakpoints[ResponsiveBreakpoints["TABLET"] = 560] = "TABLET";
    ResponsiveBreakpoints[ResponsiveBreakpoints["POTATO"] = 1024] = "POTATO";
    ResponsiveBreakpoints[ResponsiveBreakpoints["DESKTOP"] = 1280] = "DESKTOP";
})(ResponsiveBreakpoints || (ResponsiveBreakpoints = {}));
var ResponsiveStages;
(function (ResponsiveStages) {
    ResponsiveStages[ResponsiveStages["MOBILE"] = 0] = "MOBILE";
    ResponsiveStages[ResponsiveStages["TABLET"] = 1] = "TABLET";
    ResponsiveStages[ResponsiveStages["POTATO"] = 2] = "POTATO";
    ResponsiveStages[ResponsiveStages["DESKTOP"] = 3] = "DESKTOP";
})(ResponsiveStages || (ResponsiveStages = {}));
class ResponsiveUtility {
    static nodes = [];
    static isListenerActive = false;
    static classes = Object.values(ResponsiveClasses).join(' ');
    static Breakpoints = ResponsiveBreakpoints;
    static Classes = ResponsiveClasses;
    static Stages = ResponsiveStages;
    static currentBreakpointKeyW = new Store('');
    static currentBreakpointW = new Store(0);
    static apply(node) {
        this.nodes.push(node);
        this.refresh(this.nodes.length - 1);
    }
    static refresh(index) {
        const nodesToRefresh = (() => {
            if (index) {
                return [this.nodes[index]];
            }
            return this.nodes;
        })();
        nodesToRefresh.forEach((node) => {
            this.setCurrentBreakpointClass(node);
        });
    }
    static setCurrentBreakpointClass(node) {
        // @ts-expect-error obj[string]
        this.setClass(ResponsiveClasses[this.currentBreakpointKeyW.value], node);
    }
    static setClass(className, node) {
        node.classList.remove(...Object.values(ResponsiveClasses));
        node.classList.add(className);
    }
    static onResize() {
        let result;
        Object.keys(ResponsiveBreakpoints).forEach((responsiveBreakpointKey) => {
            // @ts-expect-error obj[string]
            if (window.innerWidth / devicePixelRatio > ResponsiveBreakpoints[responsiveBreakpointKey]) {
                result = responsiveBreakpointKey;
            }
        });
        if (result === ResponsiveUtility.currentBreakpointKeyW.value) {
            return;
        }
        ResponsiveUtility.currentBreakpointKeyW.set(result);
        // @ts-expect-error enum[string]
        ResponsiveUtility.currentBreakpointW.set(ResponsiveBreakpoints[result]);
        ResponsiveUtility.refresh();
    }
}
if (typeof window !== String(undefined)
    && !ResponsiveUtility.isListenerActive) {
    ResponsiveUtility.onResize();
    window.addEventListener('resize', ResponsiveUtility.onResize);
    ResponsiveUtility.isListenerActive = true;
}

class ScrollUtility {
    static isDisabled = false;
    static target = document.body;
    static disable() {
        if (ScrollUtility.isDisabled) {
            return;
        }
        $(document.body).css({
            overflow: 'hidden',
            width: '100vw',
        });
    }
    static enable() {
        if (!ScrollUtility.isDisabled) {
            return;
        }
        $(document.body).css({
            overflow: 'unset',
            width: '100%',
        });
    }
}

// stolen wholesale from https://stackoverflow.com/a/61863345
const Enumerable = (target, name, desc) => {
    if (desc) {
        desc.enumerable = true;
        return desc;
    }
    Object.defineProperty(target, name, {
        set(value) {
            Object.defineProperty(this, name, {
                value,
                enumerable: true,
                writable: true,
                configurable: true,
            });
        },
        enumerable: true,
        configurable: true,
    });
};
const NonEnumerable = (target, name, desc) => {
    if (desc) {
        desc.enumerable = false;
        return desc;
    }
    Object.defineProperty(target, name, {
        set(value) {
            Object.defineProperty(this, name, {
                value,
                writable: true,
                configurable: true,
            });
        },
        configurable: true,
    });
};

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function getDefaultExportFromNamespaceIfPresent (n) {
	return n && Object.prototype.hasOwnProperty.call(n, 'default') ? n['default'] : n;
}

function getDefaultExportFromNamespaceIfNotNamed (n) {
	return n && Object.prototype.hasOwnProperty.call(n, 'default') && Object.keys(n).length === 1 ? n['default'] : n;
}

function getAugmentedNamespace(n) {
	if (n.__esModule) return n;
	var a = Object.defineProperty({}, '__esModule', {value: true});
	Object.keys(n).forEach(function (k) {
		var d = Object.getOwnPropertyDescriptor(n, k);
		Object.defineProperty(a, k, d.get ? d : {
			enumerable: true,
			get: function () {
				return n[k];
			}
		});
	});
	return a;
}

function commonjsRequire (path) {
	throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}

var stacktrace = {exports: {}};

var errorStackParser$1 = {exports: {}};

var stackframe$1 = {exports: {}};

(function (module, exports) {
(function(root, factory) {
    'use strict';
    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.

    /* istanbul ignore next */
    if (typeof undefined === 'function' && undefined.amd) {
        undefined('stackframe', [], factory);
    } else if ('object' === 'object') {
        module.exports = factory();
    } else {
        root.StackFrame = factory();
    }
}(commonjsGlobal, function() {
    'use strict';
    function _isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    function _capitalize(str) {
        return str.charAt(0).toUpperCase() + str.substring(1);
    }

    function _getter(p) {
        return function() {
            return this[p];
        };
    }

    var booleanProps = ['isConstructor', 'isEval', 'isNative', 'isToplevel'];
    var numericProps = ['columnNumber', 'lineNumber'];
    var stringProps = ['fileName', 'functionName', 'source'];
    var arrayProps = ['args'];
    var objectProps = ['evalOrigin'];

    var props = booleanProps.concat(numericProps, stringProps, arrayProps, objectProps);

    function StackFrame(obj) {
        if (!obj) return;
        for (var i = 0; i < props.length; i++) {
            if (obj[props[i]] !== undefined) {
                this['set' + _capitalize(props[i])](obj[props[i]]);
            }
        }
    }

    StackFrame.prototype = {
        getArgs: function() {
            return this.args;
        },
        setArgs: function(v) {
            if (Object.prototype.toString.call(v) !== '[object Array]') {
                throw new TypeError('Args must be an Array');
            }
            this.args = v;
        },

        getEvalOrigin: function() {
            return this.evalOrigin;
        },
        setEvalOrigin: function(v) {
            if (v instanceof StackFrame) {
                this.evalOrigin = v;
            } else if (v instanceof Object) {
                this.evalOrigin = new StackFrame(v);
            } else {
                throw new TypeError('Eval Origin must be an Object or StackFrame');
            }
        },

        toString: function() {
            var fileName = this.getFileName() || '';
            var lineNumber = this.getLineNumber() || '';
            var columnNumber = this.getColumnNumber() || '';
            var functionName = this.getFunctionName() || '';
            if (this.getIsEval()) {
                if (fileName) {
                    return '[eval] (' + fileName + ':' + lineNumber + ':' + columnNumber + ')';
                }
                return '[eval]:' + lineNumber + ':' + columnNumber;
            }
            if (functionName) {
                return functionName + ' (' + fileName + ':' + lineNumber + ':' + columnNumber + ')';
            }
            return fileName + ':' + lineNumber + ':' + columnNumber;
        }
    };

    StackFrame.fromString = function StackFrame$$fromString(str) {
        var argsStartIndex = str.indexOf('(');
        var argsEndIndex = str.lastIndexOf(')');

        var functionName = str.substring(0, argsStartIndex);
        var args = str.substring(argsStartIndex + 1, argsEndIndex).split(',');
        var locationString = str.substring(argsEndIndex + 1);

        if (locationString.indexOf('@') === 0) {
            var parts = /@(.+?)(?::(\d+))?(?::(\d+))?$/.exec(locationString, '');
            var fileName = parts[1];
            var lineNumber = parts[2];
            var columnNumber = parts[3];
        }

        return new StackFrame({
            functionName: functionName,
            args: args || undefined,
            fileName: fileName,
            lineNumber: lineNumber || undefined,
            columnNumber: columnNumber || undefined
        });
    };

    for (var i = 0; i < booleanProps.length; i++) {
        StackFrame.prototype['get' + _capitalize(booleanProps[i])] = _getter(booleanProps[i]);
        StackFrame.prototype['set' + _capitalize(booleanProps[i])] = (function(p) {
            return function(v) {
                this[p] = Boolean(v);
            };
        })(booleanProps[i]);
    }

    for (var j = 0; j < numericProps.length; j++) {
        StackFrame.prototype['get' + _capitalize(numericProps[j])] = _getter(numericProps[j]);
        StackFrame.prototype['set' + _capitalize(numericProps[j])] = (function(p) {
            return function(v) {
                if (!_isNumber(v)) {
                    throw new TypeError(p + ' must be a Number');
                }
                this[p] = Number(v);
            };
        })(numericProps[j]);
    }

    for (var k = 0; k < stringProps.length; k++) {
        StackFrame.prototype['get' + _capitalize(stringProps[k])] = _getter(stringProps[k]);
        StackFrame.prototype['set' + _capitalize(stringProps[k])] = (function(p) {
            return function(v) {
                this[p] = String(v);
            };
        })(stringProps[k]);
    }

    return StackFrame;
}));
}(stackframe$1, stackframe$1.exports));

var stackframe = stackframe$1.exports;

(function (module, exports) {
(function(root, factory) {
    'use strict';
    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.

    /* istanbul ignore next */
    if (typeof undefined === 'function' && undefined.amd) {
        undefined('error-stack-parser', ['stackframe'], factory);
    } else if ('object' === 'object') {
        module.exports = factory(stackframe$1.exports);
    } else {
        root.ErrorStackParser = factory(root.StackFrame);
    }
}(commonjsGlobal, function ErrorStackParser(StackFrame) {
    'use strict';

    var FIREFOX_SAFARI_STACK_REGEXP = /(^|@)\S+:\d+/;
    var CHROME_IE_STACK_REGEXP = /^\s*at .*(\S+:\d+|\(native\))/m;
    var SAFARI_NATIVE_CODE_REGEXP = /^(eval@)?(\[native code])?$/;

    return {
        /**
         * Given an Error object, extract the most information from it.
         *
         * @param {Error} error object
         * @return {Array} of StackFrames
         */
        parse: function ErrorStackParser$$parse(error) {
            if (typeof error.stacktrace !== 'undefined' || typeof error['opera#sourceloc'] !== 'undefined') {
                return this.parseOpera(error);
            } else if (error.stack && error.stack.match(CHROME_IE_STACK_REGEXP)) {
                return this.parseV8OrIE(error);
            } else if (error.stack) {
                return this.parseFFOrSafari(error);
            } else {
                throw new Error('Cannot parse given Error object');
            }
        },

        // Separate line and column numbers from a string of the form: (URI:Line:Column)
        extractLocation: function ErrorStackParser$$extractLocation(urlLike) {
            // Fail-fast but return locations like "(native)"
            if (urlLike.indexOf(':') === -1) {
                return [urlLike];
            }

            var regExp = /(.+?)(?::(\d+))?(?::(\d+))?$/;
            var parts = regExp.exec(urlLike.replace(/[()]/g, ''));
            return [parts[1], parts[2] || undefined, parts[3] || undefined];
        },

        parseV8OrIE: function ErrorStackParser$$parseV8OrIE(error) {
            var filtered = error.stack.split('\n').filter(function(line) {
                return !!line.match(CHROME_IE_STACK_REGEXP);
            }, this);

            return filtered.map(function(line) {
                if (line.indexOf('(eval ') > -1) {
                    // Throw away eval information until we implement stacktrace.js/stackframe#8
                    line = line.replace(/eval code/g, 'eval').replace(/(\(eval at [^()]*)|(\),.*$)/g, '');
                }
                var sanitizedLine = line.replace(/^\s+/, '').replace(/\(eval code/g, '(');

                // capture and preseve the parenthesized location "(/foo/my bar.js:12:87)" in
                // case it has spaces in it, as the string is split on \s+ later on
                var location = sanitizedLine.match(/ (\((.+):(\d+):(\d+)\)$)/);

                // remove the parenthesized location from the line, if it was matched
                sanitizedLine = location ? sanitizedLine.replace(location[0], '') : sanitizedLine;

                var tokens = sanitizedLine.split(/\s+/).slice(1);
                // if a location was matched, pass it to extractLocation() otherwise pop the last token
                var locationParts = this.extractLocation(location ? location[1] : tokens.pop());
                var functionName = tokens.join(' ') || undefined;
                var fileName = ['eval', '<anonymous>'].indexOf(locationParts[0]) > -1 ? undefined : locationParts[0];

                return new StackFrame({
                    functionName: functionName,
                    fileName: fileName,
                    lineNumber: locationParts[1],
                    columnNumber: locationParts[2],
                    source: line
                });
            }, this);
        },

        parseFFOrSafari: function ErrorStackParser$$parseFFOrSafari(error) {
            var filtered = error.stack.split('\n').filter(function(line) {
                return !line.match(SAFARI_NATIVE_CODE_REGEXP);
            }, this);

            return filtered.map(function(line) {
                // Throw away eval information until we implement stacktrace.js/stackframe#8
                if (line.indexOf(' > eval') > -1) {
                    line = line.replace(/ line (\d+)(?: > eval line \d+)* > eval:\d+:\d+/g, ':$1');
                }

                if (line.indexOf('@') === -1 && line.indexOf(':') === -1) {
                    // Safari eval frames only have function names and nothing else
                    return new StackFrame({
                        functionName: line
                    });
                } else {
                    var functionNameRegex = /((.*".+"[^@]*)?[^@]*)(?:@)/;
                    var matches = line.match(functionNameRegex);
                    var functionName = matches && matches[1] ? matches[1] : undefined;
                    var locationParts = this.extractLocation(line.replace(functionNameRegex, ''));

                    return new StackFrame({
                        functionName: functionName,
                        fileName: locationParts[0],
                        lineNumber: locationParts[1],
                        columnNumber: locationParts[2],
                        source: line
                    });
                }
            }, this);
        },

        parseOpera: function ErrorStackParser$$parseOpera(e) {
            if (!e.stacktrace || (e.message.indexOf('\n') > -1 &&
                e.message.split('\n').length > e.stacktrace.split('\n').length)) {
                return this.parseOpera9(e);
            } else if (!e.stack) {
                return this.parseOpera10(e);
            } else {
                return this.parseOpera11(e);
            }
        },

        parseOpera9: function ErrorStackParser$$parseOpera9(e) {
            var lineRE = /Line (\d+).*script (?:in )?(\S+)/i;
            var lines = e.message.split('\n');
            var result = [];

            for (var i = 2, len = lines.length; i < len; i += 2) {
                var match = lineRE.exec(lines[i]);
                if (match) {
                    result.push(new StackFrame({
                        fileName: match[2],
                        lineNumber: match[1],
                        source: lines[i]
                    }));
                }
            }

            return result;
        },

        parseOpera10: function ErrorStackParser$$parseOpera10(e) {
            var lineRE = /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i;
            var lines = e.stacktrace.split('\n');
            var result = [];

            for (var i = 0, len = lines.length; i < len; i += 2) {
                var match = lineRE.exec(lines[i]);
                if (match) {
                    result.push(
                        new StackFrame({
                            functionName: match[3] || undefined,
                            fileName: match[2],
                            lineNumber: match[1],
                            source: lines[i]
                        })
                    );
                }
            }

            return result;
        },

        // Opera 10.65+ Error.stack very similar to FF/Safari
        parseOpera11: function ErrorStackParser$$parseOpera11(error) {
            var filtered = error.stack.split('\n').filter(function(line) {
                return !!line.match(FIREFOX_SAFARI_STACK_REGEXP) && !line.match(/^Error created at/);
            }, this);

            return filtered.map(function(line) {
                var tokens = line.split('@');
                var locationParts = this.extractLocation(tokens.pop());
                var functionCall = (tokens.shift() || '');
                var functionName = functionCall
                    .replace(/<anonymous function(: (\w+))?>/, '$2')
                    .replace(/\([^)]*\)/g, '') || undefined;
                var argsRaw;
                if (functionCall.match(/\(([^)]*)\)/)) {
                    argsRaw = functionCall.replace(/^[^(]+\(([^)]*)\)$/, '$1');
                }
                var args = (argsRaw === undefined || argsRaw === '[arguments not available]') ?
                    undefined : argsRaw.split(',');

                return new StackFrame({
                    functionName: functionName,
                    args: args,
                    fileName: locationParts[0],
                    lineNumber: locationParts[1],
                    columnNumber: locationParts[2],
                    source: line
                });
            }, this);
        }
    };
}));
}(errorStackParser$1, errorStackParser$1.exports));

var errorStackParser = errorStackParser$1.exports;

var stackGenerator$1 = {exports: {}};

(function (module, exports) {
(function(root, factory) {
    'use strict';
    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.

    /* istanbul ignore next */
    if (typeof undefined === 'function' && undefined.amd) {
        undefined('stack-generator', ['stackframe'], factory);
    } else if ('object' === 'object') {
        module.exports = factory(stackframe$1.exports);
    } else {
        root.StackGenerator = factory(root.StackFrame);
    }
}(commonjsGlobal, function(StackFrame) {
    return {
        backtrace: function StackGenerator$$backtrace(opts) {
            var stack = [];
            var maxStackSize = 10;

            if (typeof opts === 'object' && typeof opts.maxStackSize === 'number') {
                maxStackSize = opts.maxStackSize;
            }

            var curr = arguments.callee;
            while (curr && stack.length < maxStackSize && curr['arguments']) {
                // Allow V8 optimizations
                var args = new Array(curr['arguments'].length);
                for (var i = 0; i < args.length; ++i) {
                    args[i] = curr['arguments'][i];
                }
                if (/function(?:\s+([\w$]+))+\s*\(/.test(curr.toString())) {
                    stack.push(new StackFrame({functionName: RegExp.$1 || undefined, args: args}));
                } else {
                    stack.push(new StackFrame({args: args}));
                }

                try {
                    curr = curr.caller;
                } catch (e) {
                    break;
                }
            }
            return stack;
        }
    };
}));
}(stackGenerator$1, stackGenerator$1.exports));

var stackGenerator = stackGenerator$1.exports;

var stacktraceGps$1 = {exports: {}};

var sourceMapConsumer = {};

var util$2 = {};

/* -*- Mode: js; js-indent-level: 2; -*- */

(function (exports) {
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

/**
 * This is a helper function for getting values from parameter/options
 * objects.
 *
 * @param args The object we are extracting values from
 * @param name The name of the property we are getting.
 * @param defaultValue An optional value to return if the property is missing
 * from the object. If this is not specified and the property is missing, an
 * error will be thrown.
 */
function getArg(aArgs, aName, aDefaultValue) {
  if (aName in aArgs) {
    return aArgs[aName];
  } else if (arguments.length === 3) {
    return aDefaultValue;
  } else {
    throw new Error('"' + aName + '" is a required argument.');
  }
}
exports.getArg = getArg;

var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.]*)(?::(\d+))?(\S*)$/;
var dataUrlRegexp = /^data:.+\,.+$/;

function urlParse(aUrl) {
  var match = aUrl.match(urlRegexp);
  if (!match) {
    return null;
  }
  return {
    scheme: match[1],
    auth: match[2],
    host: match[3],
    port: match[4],
    path: match[5]
  };
}
exports.urlParse = urlParse;

function urlGenerate(aParsedUrl) {
  var url = '';
  if (aParsedUrl.scheme) {
    url += aParsedUrl.scheme + ':';
  }
  url += '//';
  if (aParsedUrl.auth) {
    url += aParsedUrl.auth + '@';
  }
  if (aParsedUrl.host) {
    url += aParsedUrl.host;
  }
  if (aParsedUrl.port) {
    url += ":" + aParsedUrl.port;
  }
  if (aParsedUrl.path) {
    url += aParsedUrl.path;
  }
  return url;
}
exports.urlGenerate = urlGenerate;

/**
 * Normalizes a path, or the path portion of a URL:
 *
 * - Replaces consecutive slashes with one slash.
 * - Removes unnecessary '.' parts.
 * - Removes unnecessary '<dir>/..' parts.
 *
 * Based on code in the Node.js 'path' core module.
 *
 * @param aPath The path or url to normalize.
 */
function normalize(aPath) {
  var path = aPath;
  var url = urlParse(aPath);
  if (url) {
    if (!url.path) {
      return aPath;
    }
    path = url.path;
  }
  var isAbsolute = exports.isAbsolute(path);

  var parts = path.split(/\/+/);
  for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
    part = parts[i];
    if (part === '.') {
      parts.splice(i, 1);
    } else if (part === '..') {
      up++;
    } else if (up > 0) {
      if (part === '') {
        // The first part is blank if the path is absolute. Trying to go
        // above the root is a no-op. Therefore we can remove all '..' parts
        // directly after the root.
        parts.splice(i + 1, up);
        up = 0;
      } else {
        parts.splice(i, 2);
        up--;
      }
    }
  }
  path = parts.join('/');

  if (path === '') {
    path = isAbsolute ? '/' : '.';
  }

  if (url) {
    url.path = path;
    return urlGenerate(url);
  }
  return path;
}
exports.normalize = normalize;

/**
 * Joins two paths/URLs.
 *
 * @param aRoot The root path or URL.
 * @param aPath The path or URL to be joined with the root.
 *
 * - If aPath is a URL or a data URI, aPath is returned, unless aPath is a
 *   scheme-relative URL: Then the scheme of aRoot, if any, is prepended
 *   first.
 * - Otherwise aPath is a path. If aRoot is a URL, then its path portion
 *   is updated with the result and aRoot is returned. Otherwise the result
 *   is returned.
 *   - If aPath is absolute, the result is aPath.
 *   - Otherwise the two paths are joined with a slash.
 * - Joining for example 'http://' and 'www.example.com' is also supported.
 */
function join(aRoot, aPath) {
  if (aRoot === "") {
    aRoot = ".";
  }
  if (aPath === "") {
    aPath = ".";
  }
  var aPathUrl = urlParse(aPath);
  var aRootUrl = urlParse(aRoot);
  if (aRootUrl) {
    aRoot = aRootUrl.path || '/';
  }

  // `join(foo, '//www.example.org')`
  if (aPathUrl && !aPathUrl.scheme) {
    if (aRootUrl) {
      aPathUrl.scheme = aRootUrl.scheme;
    }
    return urlGenerate(aPathUrl);
  }

  if (aPathUrl || aPath.match(dataUrlRegexp)) {
    return aPath;
  }

  // `join('http://', 'www.example.com')`
  if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
    aRootUrl.host = aPath;
    return urlGenerate(aRootUrl);
  }

  var joined = aPath.charAt(0) === '/'
    ? aPath
    : normalize(aRoot.replace(/\/+$/, '') + '/' + aPath);

  if (aRootUrl) {
    aRootUrl.path = joined;
    return urlGenerate(aRootUrl);
  }
  return joined;
}
exports.join = join;

exports.isAbsolute = function (aPath) {
  return aPath.charAt(0) === '/' || !!aPath.match(urlRegexp);
};

/**
 * Make a path relative to a URL or another path.
 *
 * @param aRoot The root path or URL.
 * @param aPath The path or URL to be made relative to aRoot.
 */
function relative(aRoot, aPath) {
  if (aRoot === "") {
    aRoot = ".";
  }

  aRoot = aRoot.replace(/\/$/, '');

  // It is possible for the path to be above the root. In this case, simply
  // checking whether the root is a prefix of the path won't work. Instead, we
  // need to remove components from the root one by one, until either we find
  // a prefix that fits, or we run out of components to remove.
  var level = 0;
  while (aPath.indexOf(aRoot + '/') !== 0) {
    var index = aRoot.lastIndexOf("/");
    if (index < 0) {
      return aPath;
    }

    // If the only part of the root that is left is the scheme (i.e. http://,
    // file:///, etc.), one or more slashes (/), or simply nothing at all, we
    // have exhausted all components, so the path is not relative to the root.
    aRoot = aRoot.slice(0, index);
    if (aRoot.match(/^([^\/]+:\/)?\/*$/)) {
      return aPath;
    }

    ++level;
  }

  // Make sure we add a "../" for each component we removed from the root.
  return Array(level + 1).join("../") + aPath.substr(aRoot.length + 1);
}
exports.relative = relative;

var supportsNullProto = (function () {
  var obj = Object.create(null);
  return !('__proto__' in obj);
}());

function identity (s) {
  return s;
}

/**
 * Because behavior goes wacky when you set `__proto__` on objects, we
 * have to prefix all the strings in our set with an arbitrary character.
 *
 * See https://github.com/mozilla/source-map/pull/31 and
 * https://github.com/mozilla/source-map/issues/30
 *
 * @param String aStr
 */
function toSetString(aStr) {
  if (isProtoString(aStr)) {
    return '$' + aStr;
  }

  return aStr;
}
exports.toSetString = supportsNullProto ? identity : toSetString;

function fromSetString(aStr) {
  if (isProtoString(aStr)) {
    return aStr.slice(1);
  }

  return aStr;
}
exports.fromSetString = supportsNullProto ? identity : fromSetString;

function isProtoString(s) {
  if (!s) {
    return false;
  }

  var length = s.length;

  if (length < 9 /* "__proto__".length */) {
    return false;
  }

  if (s.charCodeAt(length - 1) !== 95  /* '_' */ ||
      s.charCodeAt(length - 2) !== 95  /* '_' */ ||
      s.charCodeAt(length - 3) !== 111 /* 'o' */ ||
      s.charCodeAt(length - 4) !== 116 /* 't' */ ||
      s.charCodeAt(length - 5) !== 111 /* 'o' */ ||
      s.charCodeAt(length - 6) !== 114 /* 'r' */ ||
      s.charCodeAt(length - 7) !== 112 /* 'p' */ ||
      s.charCodeAt(length - 8) !== 95  /* '_' */ ||
      s.charCodeAt(length - 9) !== 95  /* '_' */) {
    return false;
  }

  for (var i = length - 10; i >= 0; i--) {
    if (s.charCodeAt(i) !== 36 /* '$' */) {
      return false;
    }
  }

  return true;
}

/**
 * Comparator between two mappings where the original positions are compared.
 *
 * Optionally pass in `true` as `onlyCompareGenerated` to consider two
 * mappings with the same original source/line/column, but different generated
 * line and column the same. Useful when searching for a mapping with a
 * stubbed out mapping.
 */
function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
  var cmp = mappingA.source - mappingB.source;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0 || onlyCompareOriginal) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  return mappingA.name - mappingB.name;
}
exports.compareByOriginalPositions = compareByOriginalPositions;

/**
 * Comparator between two mappings with deflated source and name indices where
 * the generated positions are compared.
 *
 * Optionally pass in `true` as `onlyCompareGenerated` to consider two
 * mappings with the same generated line and column, but different
 * source/name/original line and column the same. Useful when searching for a
 * mapping with a stubbed out mapping.
 */
function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
  var cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0 || onlyCompareGenerated) {
    return cmp;
  }

  cmp = mappingA.source - mappingB.source;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0) {
    return cmp;
  }

  return mappingA.name - mappingB.name;
}
exports.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;

function strcmp(aStr1, aStr2) {
  if (aStr1 === aStr2) {
    return 0;
  }

  if (aStr1 > aStr2) {
    return 1;
  }

  return -1;
}

/**
 * Comparator between two mappings with inflated source and name strings where
 * the generated positions are compared.
 */
function compareByGeneratedPositionsInflated(mappingA, mappingB) {
  var cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = strcmp(mappingA.source, mappingB.source);
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0) {
    return cmp;
  }

  return strcmp(mappingA.name, mappingB.name);
}
exports.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;
}(util$2));

var binarySearch$1 = {};

/* -*- Mode: js; js-indent-level: 2; -*- */

(function (exports) {
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

exports.GREATEST_LOWER_BOUND = 1;
exports.LEAST_UPPER_BOUND = 2;

/**
 * Recursive implementation of binary search.
 *
 * @param aLow Indices here and lower do not contain the needle.
 * @param aHigh Indices here and higher do not contain the needle.
 * @param aNeedle The element being searched for.
 * @param aHaystack The non-empty array being searched.
 * @param aCompare Function which takes two elements and returns -1, 0, or 1.
 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 */
function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {
  // This function terminates when one of the following is true:
  //
  //   1. We find the exact element we are looking for.
  //
  //   2. We did not find the exact element, but we can return the index of
  //      the next-closest element.
  //
  //   3. We did not find the exact element, and there is no next-closest
  //      element than the one we are searching for, so we return -1.
  var mid = Math.floor((aHigh - aLow) / 2) + aLow;
  var cmp = aCompare(aNeedle, aHaystack[mid], true);
  if (cmp === 0) {
    // Found the element we are looking for.
    return mid;
  }
  else if (cmp > 0) {
    // Our needle is greater than aHaystack[mid].
    if (aHigh - mid > 1) {
      // The element is in the upper half.
      return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);
    }

    // The exact needle element was not found in this haystack. Determine if
    // we are in termination case (3) or (2) and return the appropriate thing.
    if (aBias == exports.LEAST_UPPER_BOUND) {
      return aHigh < aHaystack.length ? aHigh : -1;
    } else {
      return mid;
    }
  }
  else {
    // Our needle is less than aHaystack[mid].
    if (mid - aLow > 1) {
      // The element is in the lower half.
      return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);
    }

    // we are in termination case (3) or (2) and return the appropriate thing.
    if (aBias == exports.LEAST_UPPER_BOUND) {
      return mid;
    } else {
      return aLow < 0 ? -1 : aLow;
    }
  }
}

/**
 * This is an implementation of binary search which will always try and return
 * the index of the closest element if there is no exact hit. This is because
 * mappings between original and generated line/col pairs are single points,
 * and there is an implicit region between each of them, so a miss just means
 * that you aren't on the very start of a region.
 *
 * @param aNeedle The element you are looking for.
 * @param aHaystack The array that is being searched.
 * @param aCompare A function which takes the needle and an element in the
 *     array and returns -1, 0, or 1 depending on whether the needle is less
 *     than, equal to, or greater than the element, respectively.
 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'binarySearch.GREATEST_LOWER_BOUND'.
 */
exports.search = function search(aNeedle, aHaystack, aCompare, aBias) {
  if (aHaystack.length === 0) {
    return -1;
  }

  var index = recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack,
                              aCompare, aBias || exports.GREATEST_LOWER_BOUND);
  if (index < 0) {
    return -1;
  }

  // We have found either the exact element, or the next-closest element than
  // the one we are searching for. However, there may be more than one such
  // element. Make sure we always return the smallest of these.
  while (index - 1 >= 0) {
    if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) {
      break;
    }
    --index;
  }

  return index;
};
}(binarySearch$1));

var arraySet = {};

/* -*- Mode: js; js-indent-level: 2; -*- */

/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var util$1 = util$2;
var has = Object.prototype.hasOwnProperty;

/**
 * A data structure which is a combination of an array and a set. Adding a new
 * member is O(1), testing for membership is O(1), and finding the index of an
 * element is O(1). Removing elements from the set is not supported. Only
 * strings are supported for membership.
 */
function ArraySet$1() {
  this._array = [];
  this._set = Object.create(null);
}

/**
 * Static method for creating ArraySet instances from an existing array.
 */
ArraySet$1.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
  var set = new ArraySet$1();
  for (var i = 0, len = aArray.length; i < len; i++) {
    set.add(aArray[i], aAllowDuplicates);
  }
  return set;
};

/**
 * Return how many unique items are in this ArraySet. If duplicates have been
 * added, than those do not count towards the size.
 *
 * @returns Number
 */
ArraySet$1.prototype.size = function ArraySet_size() {
  return Object.getOwnPropertyNames(this._set).length;
};

/**
 * Add the given string to this set.
 *
 * @param String aStr
 */
ArraySet$1.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
  var sStr = util$1.toSetString(aStr);
  var isDuplicate = has.call(this._set, sStr);
  var idx = this._array.length;
  if (!isDuplicate || aAllowDuplicates) {
    this._array.push(aStr);
  }
  if (!isDuplicate) {
    this._set[sStr] = idx;
  }
};

/**
 * Is the given string a member of this set?
 *
 * @param String aStr
 */
ArraySet$1.prototype.has = function ArraySet_has(aStr) {
  var sStr = util$1.toSetString(aStr);
  return has.call(this._set, sStr);
};

/**
 * What is the index of the given string in the array?
 *
 * @param String aStr
 */
ArraySet$1.prototype.indexOf = function ArraySet_indexOf(aStr) {
  var sStr = util$1.toSetString(aStr);
  if (has.call(this._set, sStr)) {
    return this._set[sStr];
  }
  throw new Error('"' + aStr + '" is not in the set.');
};

/**
 * What is the element at the given index?
 *
 * @param Number aIdx
 */
ArraySet$1.prototype.at = function ArraySet_at(aIdx) {
  if (aIdx >= 0 && aIdx < this._array.length) {
    return this._array[aIdx];
  }
  throw new Error('No element indexed by ' + aIdx);
};

/**
 * Returns the array representation of this set (which has the proper indices
 * indicated by indexOf). Note that this is a copy of the internal array used
 * for storing the members so that no one can mess with internal state.
 */
ArraySet$1.prototype.toArray = function ArraySet_toArray() {
  return this._array.slice();
};

var ArraySet_1 = arraySet.ArraySet = ArraySet$1;

var base64Vlq = {};

var base64$1 = {};

/* -*- Mode: js; js-indent-level: 2; -*- */

/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var intToCharMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');

/**
 * Encode an integer in the range of 0 to 63 to a single base 64 digit.
 */
var encode$1 = base64$1.encode = function (number) {
  if (0 <= number && number < intToCharMap.length) {
    return intToCharMap[number];
  }
  throw new TypeError("Must be between 0 and 63: " + number);
};

/**
 * Decode a single base 64 character code digit to an integer. Returns -1 on
 * failure.
 */
var decode$1 = base64$1.decode = function (charCode) {
  var bigA = 65;     // 'A'
  var bigZ = 90;     // 'Z'

  var littleA = 97;  // 'a'
  var littleZ = 122; // 'z'

  var zero = 48;     // '0'
  var nine = 57;     // '9'

  var plus = 43;     // '+'
  var slash = 47;    // '/'

  var littleOffset = 26;
  var numberOffset = 52;

  // 0 - 25: ABCDEFGHIJKLMNOPQRSTUVWXYZ
  if (bigA <= charCode && charCode <= bigZ) {
    return (charCode - bigA);
  }

  // 26 - 51: abcdefghijklmnopqrstuvwxyz
  if (littleA <= charCode && charCode <= littleZ) {
    return (charCode - littleA + littleOffset);
  }

  // 52 - 61: 0123456789
  if (zero <= charCode && charCode <= nine) {
    return (charCode - zero + numberOffset);
  }

  // 62: +
  if (charCode == plus) {
    return 62;
  }

  // 63: /
  if (charCode == slash) {
    return 63;
  }

  // Invalid base64 digit.
  return -1;
};

/* -*- Mode: js; js-indent-level: 2; -*- */

/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 *
 * Based on the Base 64 VLQ implementation in Closure Compiler:
 * https://code.google.com/p/closure-compiler/source/browse/trunk/src/com/google/debugging/sourcemap/Base64VLQ.java
 *
 * Copyright 2011 The Closure Compiler Authors. All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *  * Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above
 *    copyright notice, this list of conditions and the following
 *    disclaimer in the documentation and/or other materials provided
 *    with the distribution.
 *  * Neither the name of Google Inc. nor the names of its
 *    contributors may be used to endorse or promote products derived
 *    from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

var base64 = base64$1;

// A single base 64 digit can contain 6 bits of data. For the base 64 variable
// length quantities we use in the source map spec, the first bit is the sign,
// the next four bits are the actual value, and the 6th bit is the
// continuation bit. The continuation bit tells us whether there are more
// digits in this value following this digit.
//
//   Continuation
//   |    Sign
//   |    |
//   V    V
//   101011

var VLQ_BASE_SHIFT = 5;

// binary: 100000
var VLQ_BASE = 1 << VLQ_BASE_SHIFT;

// binary: 011111
var VLQ_BASE_MASK = VLQ_BASE - 1;

// binary: 100000
var VLQ_CONTINUATION_BIT = VLQ_BASE;

/**
 * Converts from a two-complement value to a value where the sign bit is
 * placed in the least significant bit.  For example, as decimals:
 *   1 becomes 2 (10 binary), -1 becomes 3 (11 binary)
 *   2 becomes 4 (100 binary), -2 becomes 5 (101 binary)
 */
function toVLQSigned(aValue) {
  return aValue < 0
    ? ((-aValue) << 1) + 1
    : (aValue << 1) + 0;
}

/**
 * Converts to a two-complement value from a value where the sign bit is
 * placed in the least significant bit.  For example, as decimals:
 *   2 (10 binary) becomes 1, 3 (11 binary) becomes -1
 *   4 (100 binary) becomes 2, 5 (101 binary) becomes -2
 */
function fromVLQSigned(aValue) {
  var isNegative = (aValue & 1) === 1;
  var shifted = aValue >> 1;
  return isNegative
    ? -shifted
    : shifted;
}

/**
 * Returns the base 64 VLQ encoded value.
 */
var encode = base64Vlq.encode = function base64VLQ_encode(aValue) {
  var encoded = "";
  var digit;

  var vlq = toVLQSigned(aValue);

  do {
    digit = vlq & VLQ_BASE_MASK;
    vlq >>>= VLQ_BASE_SHIFT;
    if (vlq > 0) {
      // There are still more digits in this value, so we must make sure the
      // continuation bit is marked.
      digit |= VLQ_CONTINUATION_BIT;
    }
    encoded += base64.encode(digit);
  } while (vlq > 0);

  return encoded;
};

/**
 * Decodes the next base 64 VLQ value from the given string and returns the
 * value and the rest of the string via the out parameter.
 */
var decode = base64Vlq.decode = function base64VLQ_decode(aStr, aIndex, aOutParam) {
  var strLen = aStr.length;
  var result = 0;
  var shift = 0;
  var continuation, digit;

  do {
    if (aIndex >= strLen) {
      throw new Error("Expected more digits in base 64 VLQ value.");
    }

    digit = base64.decode(aStr.charCodeAt(aIndex++));
    if (digit === -1) {
      throw new Error("Invalid base64 digit: " + aStr.charAt(aIndex - 1));
    }

    continuation = !!(digit & VLQ_CONTINUATION_BIT);
    digit &= VLQ_BASE_MASK;
    result = result + (digit << shift);
    shift += VLQ_BASE_SHIFT;
  } while (continuation);

  aOutParam.value = fromVLQSigned(result);
  aOutParam.rest = aIndex;
};

var quickSort$1 = {};

/* -*- Mode: js; js-indent-level: 2; -*- */

/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

// It turns out that some (most?) JavaScript engines don't self-host
// `Array.prototype.sort`. This makes sense because C++ will likely remain
// faster than JS when doing raw CPU-intensive sorting. However, when using a
// custom comparator function, calling back and forth between the VM's C++ and
// JIT'd JS is rather slow *and* loses JIT type information, resulting in
// worse generated code for the comparator function than would be optimal. In
// fact, when sorting with a comparator, these costs outweigh the benefits of
// sorting in C++. By using our own JS-implemented Quick Sort (below), we get
// a ~3500ms mean speed-up in `bench/bench.html`.

/**
 * Swap the elements indexed by `x` and `y` in the array `ary`.
 *
 * @param {Array} ary
 *        The array.
 * @param {Number} x
 *        The index of the first item.
 * @param {Number} y
 *        The index of the second item.
 */
function swap(ary, x, y) {
  var temp = ary[x];
  ary[x] = ary[y];
  ary[y] = temp;
}

/**
 * Returns a random integer within the range `low .. high` inclusive.
 *
 * @param {Number} low
 *        The lower bound on the range.
 * @param {Number} high
 *        The upper bound on the range.
 */
function randomIntInRange(low, high) {
  return Math.round(low + (Math.random() * (high - low)));
}

/**
 * The Quick Sort algorithm.
 *
 * @param {Array} ary
 *        An array to sort.
 * @param {function} comparator
 *        Function to use to compare two items.
 * @param {Number} p
 *        Start index of the array
 * @param {Number} r
 *        End index of the array
 */
function doQuickSort(ary, comparator, p, r) {
  // If our lower bound is less than our upper bound, we (1) partition the
  // array into two pieces and (2) recurse on each half. If it is not, this is
  // the empty array and our base case.

  if (p < r) {
    // (1) Partitioning.
    //
    // The partitioning chooses a pivot between `p` and `r` and moves all
    // elements that are less than or equal to the pivot to the before it, and
    // all the elements that are greater than it after it. The effect is that
    // once partition is done, the pivot is in the exact place it will be when
    // the array is put in sorted order, and it will not need to be moved
    // again. This runs in O(n) time.

    // Always choose a random pivot so that an input array which is reverse
    // sorted does not cause O(n^2) running time.
    var pivotIndex = randomIntInRange(p, r);
    var i = p - 1;

    swap(ary, pivotIndex, r);
    var pivot = ary[r];

    // Immediately after `j` is incremented in this loop, the following hold
    // true:
    //
    //   * Every element in `ary[p .. i]` is less than or equal to the pivot.
    //
    //   * Every element in `ary[i+1 .. j-1]` is greater than the pivot.
    for (var j = p; j < r; j++) {
      if (comparator(ary[j], pivot) <= 0) {
        i += 1;
        swap(ary, i, j);
      }
    }

    swap(ary, i + 1, j);
    var q = i + 1;

    // (2) Recurse on each half.

    doQuickSort(ary, comparator, p, q - 1);
    doQuickSort(ary, comparator, q + 1, r);
  }
}

/**
 * Sort the given array in-place with the given comparator function.
 *
 * @param {Array} ary
 *        An array to sort.
 * @param {function} comparator
 *        Function to use to compare two items.
 */
var quickSort_1 = quickSort$1.quickSort = function (ary, comparator) {
  doQuickSort(ary, comparator, 0, ary.length - 1);
};

/* -*- Mode: js; js-indent-level: 2; -*- */

/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var util = util$2;
var binarySearch = binarySearch$1;
var ArraySet = arraySet.ArraySet;
var base64VLQ = base64Vlq;
var quickSort = quickSort$1.quickSort;

function SourceMapConsumer(aSourceMap) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
  }

  return sourceMap.sections != null
    ? new IndexedSourceMapConsumer(sourceMap)
    : new BasicSourceMapConsumer(sourceMap);
}

SourceMapConsumer.fromSourceMap = function(aSourceMap) {
  return BasicSourceMapConsumer.fromSourceMap(aSourceMap);
};

/**
 * The version of the source mapping spec that we are consuming.
 */
SourceMapConsumer.prototype._version = 3;

// `__generatedMappings` and `__originalMappings` are arrays that hold the
// parsed mapping coordinates from the source map's "mappings" attribute. They
// are lazily instantiated, accessed via the `_generatedMappings` and
// `_originalMappings` getters respectively, and we only parse the mappings
// and create these arrays once queried for a source location. We jump through
// these hoops because there can be many thousands of mappings, and parsing
// them is expensive, so we only want to do it if we must.
//
// Each object in the arrays is of the form:
//
//     {
//       generatedLine: The line number in the generated code,
//       generatedColumn: The column number in the generated code,
//       source: The path to the original source file that generated this
//               chunk of code,
//       originalLine: The line number in the original source that
//                     corresponds to this chunk of generated code,
//       originalColumn: The column number in the original source that
//                       corresponds to this chunk of generated code,
//       name: The name of the original symbol which generated this chunk of
//             code.
//     }
//
// All properties except for `generatedLine` and `generatedColumn` can be
// `null`.
//
// `_generatedMappings` is ordered by the generated positions.
//
// `_originalMappings` is ordered by the original positions.

SourceMapConsumer.prototype.__generatedMappings = null;
Object.defineProperty(SourceMapConsumer.prototype, '_generatedMappings', {
  get: function () {
    if (!this.__generatedMappings) {
      this._parseMappings(this._mappings, this.sourceRoot);
    }

    return this.__generatedMappings;
  }
});

SourceMapConsumer.prototype.__originalMappings = null;
Object.defineProperty(SourceMapConsumer.prototype, '_originalMappings', {
  get: function () {
    if (!this.__originalMappings) {
      this._parseMappings(this._mappings, this.sourceRoot);
    }

    return this.__originalMappings;
  }
});

SourceMapConsumer.prototype._charIsMappingSeparator =
  function SourceMapConsumer_charIsMappingSeparator(aStr, index) {
    var c = aStr.charAt(index);
    return c === ";" || c === ",";
  };

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
SourceMapConsumer.prototype._parseMappings =
  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    throw new Error("Subclasses must implement _parseMappings");
  };

SourceMapConsumer.GENERATED_ORDER = 1;
SourceMapConsumer.ORIGINAL_ORDER = 2;

SourceMapConsumer.GREATEST_LOWER_BOUND = 1;
SourceMapConsumer.LEAST_UPPER_BOUND = 2;

/**
 * Iterate over each mapping between an original source/line/column and a
 * generated line/column in this source map.
 *
 * @param Function aCallback
 *        The function that is called with each mapping.
 * @param Object aContext
 *        Optional. If specified, this object will be the value of `this` every
 *        time that `aCallback` is called.
 * @param aOrder
 *        Either `SourceMapConsumer.GENERATED_ORDER` or
 *        `SourceMapConsumer.ORIGINAL_ORDER`. Specifies whether you want to
 *        iterate over the mappings sorted by the generated file's line/column
 *        order or the original's source/line/column order, respectively. Defaults to
 *        `SourceMapConsumer.GENERATED_ORDER`.
 */
SourceMapConsumer.prototype.eachMapping =
  function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
    var context = aContext || null;
    var order = aOrder || SourceMapConsumer.GENERATED_ORDER;

    var mappings;
    switch (order) {
    case SourceMapConsumer.GENERATED_ORDER:
      mappings = this._generatedMappings;
      break;
    case SourceMapConsumer.ORIGINAL_ORDER:
      mappings = this._originalMappings;
      break;
    default:
      throw new Error("Unknown order of iteration.");
    }

    var sourceRoot = this.sourceRoot;
    mappings.map(function (mapping) {
      var source = mapping.source === null ? null : this._sources.at(mapping.source);
      if (source != null && sourceRoot != null) {
        source = util.join(sourceRoot, source);
      }
      return {
        source: source,
        generatedLine: mapping.generatedLine,
        generatedColumn: mapping.generatedColumn,
        originalLine: mapping.originalLine,
        originalColumn: mapping.originalColumn,
        name: mapping.name === null ? null : this._names.at(mapping.name)
      };
    }, this).forEach(aCallback, context);
  };

/**
 * Returns all generated line and column information for the original source,
 * line, and column provided. If no column is provided, returns all mappings
 * corresponding to a either the line we are searching for or the next
 * closest line that has any mappings. Otherwise, returns all mappings
 * corresponding to the given line and either the column we are searching for
 * or the next closest column that has any offsets.
 *
 * The only argument is an object with the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.
 *   - column: Optional. the column number in the original source.
 *
 * and an array of objects is returned, each with the following properties:
 *
 *   - line: The line number in the generated source, or null.
 *   - column: The column number in the generated source, or null.
 */
SourceMapConsumer.prototype.allGeneratedPositionsFor =
  function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
    var line = util.getArg(aArgs, 'line');

    // When there is no exact match, BasicSourceMapConsumer.prototype._findMapping
    // returns the index of the closest mapping less than the needle. By
    // setting needle.originalColumn to 0, we thus find the last mapping for
    // the given line, provided such a mapping exists.
    var needle = {
      source: util.getArg(aArgs, 'source'),
      originalLine: line,
      originalColumn: util.getArg(aArgs, 'column', 0)
    };

    if (this.sourceRoot != null) {
      needle.source = util.relative(this.sourceRoot, needle.source);
    }
    if (!this._sources.has(needle.source)) {
      return [];
    }
    needle.source = this._sources.indexOf(needle.source);

    var mappings = [];

    var index = this._findMapping(needle,
                                  this._originalMappings,
                                  "originalLine",
                                  "originalColumn",
                                  util.compareByOriginalPositions,
                                  binarySearch.LEAST_UPPER_BOUND);
    if (index >= 0) {
      var mapping = this._originalMappings[index];

      if (aArgs.column === undefined) {
        var originalLine = mapping.originalLine;

        // Iterate until either we run out of mappings, or we run into
        // a mapping for a different line than the one we found. Since
        // mappings are sorted, this is guaranteed to find all mappings for
        // the line we found.
        while (mapping && mapping.originalLine === originalLine) {
          mappings.push({
            line: util.getArg(mapping, 'generatedLine', null),
            column: util.getArg(mapping, 'generatedColumn', null),
            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
          });

          mapping = this._originalMappings[++index];
        }
      } else {
        var originalColumn = mapping.originalColumn;

        // Iterate until either we run out of mappings, or we run into
        // a mapping for a different line than the one we were searching for.
        // Since mappings are sorted, this is guaranteed to find all mappings for
        // the line we are searching for.
        while (mapping &&
               mapping.originalLine === line &&
               mapping.originalColumn == originalColumn) {
          mappings.push({
            line: util.getArg(mapping, 'generatedLine', null),
            column: util.getArg(mapping, 'generatedColumn', null),
            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
          });

          mapping = this._originalMappings[++index];
        }
      }
    }

    return mappings;
  };

var SourceMapConsumer_1 = sourceMapConsumer.SourceMapConsumer = SourceMapConsumer;

/**
 * A BasicSourceMapConsumer instance represents a parsed source map which we can
 * query for information about the original file positions by giving it a file
 * position in the generated source.
 *
 * The only parameter is the raw source map (either as a JSON string, or
 * already parsed to an object). According to the spec, source maps have the
 * following attributes:
 *
 *   - version: Which version of the source map spec this map is following.
 *   - sources: An array of URLs to the original source files.
 *   - names: An array of identifiers which can be referrenced by individual mappings.
 *   - sourceRoot: Optional. The URL root from which all sources are relative.
 *   - sourcesContent: Optional. An array of contents of the original source files.
 *   - mappings: A string of base64 VLQs which contain the actual mappings.
 *   - file: Optional. The generated file this source map is associated with.
 *
 * Here is an example source map, taken from the source map spec[0]:
 *
 *     {
 *       version : 3,
 *       file: "out.js",
 *       sourceRoot : "",
 *       sources: ["foo.js", "bar.js"],
 *       names: ["src", "maps", "are", "fun"],
 *       mappings: "AA,AB;;ABCDE;"
 *     }
 *
 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?pli=1#
 */
function BasicSourceMapConsumer(aSourceMap) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
  }

  var version = util.getArg(sourceMap, 'version');
  var sources = util.getArg(sourceMap, 'sources');
  // Sass 3.3 leaves out the 'names' array, so we deviate from the spec (which
  // requires the array) to play nice here.
  var names = util.getArg(sourceMap, 'names', []);
  var sourceRoot = util.getArg(sourceMap, 'sourceRoot', null);
  var sourcesContent = util.getArg(sourceMap, 'sourcesContent', null);
  var mappings = util.getArg(sourceMap, 'mappings');
  var file = util.getArg(sourceMap, 'file', null);

  // Once again, Sass deviates from the spec and supplies the version as a
  // string rather than a number, so we use loose equality checking here.
  if (version != this._version) {
    throw new Error('Unsupported version: ' + version);
  }

  sources = sources
    .map(String)
    // Some source maps produce relative source paths like "./foo.js" instead of
    // "foo.js".  Normalize these first so that future comparisons will succeed.
    // See bugzil.la/1090768.
    .map(util.normalize)
    // Always ensure that absolute sources are internally stored relative to
    // the source root, if the source root is absolute. Not doing this would
    // be particularly problematic when the source root is a prefix of the
    // source (valid, but why??). See github issue #199 and bugzil.la/1188982.
    .map(function (source) {
      return sourceRoot && util.isAbsolute(sourceRoot) && util.isAbsolute(source)
        ? util.relative(sourceRoot, source)
        : source;
    });

  // Pass `true` below to allow duplicate names and sources. While source maps
  // are intended to be compressed and deduplicated, the TypeScript compiler
  // sometimes generates source maps with duplicates in them. See Github issue
  // #72 and bugzil.la/889492.
  this._names = ArraySet.fromArray(names.map(String), true);
  this._sources = ArraySet.fromArray(sources, true);

  this.sourceRoot = sourceRoot;
  this.sourcesContent = sourcesContent;
  this._mappings = mappings;
  this.file = file;
}

BasicSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer;

/**
 * Create a BasicSourceMapConsumer from a SourceMapGenerator.
 *
 * @param SourceMapGenerator aSourceMap
 *        The source map that will be consumed.
 * @returns BasicSourceMapConsumer
 */
BasicSourceMapConsumer.fromSourceMap =
  function SourceMapConsumer_fromSourceMap(aSourceMap) {
    var smc = Object.create(BasicSourceMapConsumer.prototype);

    var names = smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
    var sources = smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
    smc.sourceRoot = aSourceMap._sourceRoot;
    smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(),
                                                            smc.sourceRoot);
    smc.file = aSourceMap._file;

    // Because we are modifying the entries (by converting string sources and
    // names to indices into the sources and names ArraySets), we have to make
    // a copy of the entry or else bad things happen. Shared mutable state
    // strikes again! See github issue #191.

    var generatedMappings = aSourceMap._mappings.toArray().slice();
    var destGeneratedMappings = smc.__generatedMappings = [];
    var destOriginalMappings = smc.__originalMappings = [];

    for (var i = 0, length = generatedMappings.length; i < length; i++) {
      var srcMapping = generatedMappings[i];
      var destMapping = new Mapping;
      destMapping.generatedLine = srcMapping.generatedLine;
      destMapping.generatedColumn = srcMapping.generatedColumn;

      if (srcMapping.source) {
        destMapping.source = sources.indexOf(srcMapping.source);
        destMapping.originalLine = srcMapping.originalLine;
        destMapping.originalColumn = srcMapping.originalColumn;

        if (srcMapping.name) {
          destMapping.name = names.indexOf(srcMapping.name);
        }

        destOriginalMappings.push(destMapping);
      }

      destGeneratedMappings.push(destMapping);
    }

    quickSort(smc.__originalMappings, util.compareByOriginalPositions);

    return smc;
  };

/**
 * The version of the source mapping spec that we are consuming.
 */
BasicSourceMapConsumer.prototype._version = 3;

/**
 * The list of original sources.
 */
Object.defineProperty(BasicSourceMapConsumer.prototype, 'sources', {
  get: function () {
    return this._sources.toArray().map(function (s) {
      return this.sourceRoot != null ? util.join(this.sourceRoot, s) : s;
    }, this);
  }
});

/**
 * Provide the JIT with a nice shape / hidden class.
 */
function Mapping() {
  this.generatedLine = 0;
  this.generatedColumn = 0;
  this.source = null;
  this.originalLine = null;
  this.originalColumn = null;
  this.name = null;
}

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
BasicSourceMapConsumer.prototype._parseMappings =
  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    var generatedLine = 1;
    var previousGeneratedColumn = 0;
    var previousOriginalLine = 0;
    var previousOriginalColumn = 0;
    var previousSource = 0;
    var previousName = 0;
    var length = aStr.length;
    var index = 0;
    var cachedSegments = {};
    var temp = {};
    var originalMappings = [];
    var generatedMappings = [];
    var mapping, str, segment, end, value;

    while (index < length) {
      if (aStr.charAt(index) === ';') {
        generatedLine++;
        index++;
        previousGeneratedColumn = 0;
      }
      else if (aStr.charAt(index) === ',') {
        index++;
      }
      else {
        mapping = new Mapping();
        mapping.generatedLine = generatedLine;

        // Because each offset is encoded relative to the previous one,
        // many segments often have the same encoding. We can exploit this
        // fact by caching the parsed variable length fields of each segment,
        // allowing us to avoid a second parse if we encounter the same
        // segment again.
        for (end = index; end < length; end++) {
          if (this._charIsMappingSeparator(aStr, end)) {
            break;
          }
        }
        str = aStr.slice(index, end);

        segment = cachedSegments[str];
        if (segment) {
          index += str.length;
        } else {
          segment = [];
          while (index < end) {
            base64VLQ.decode(aStr, index, temp);
            value = temp.value;
            index = temp.rest;
            segment.push(value);
          }

          if (segment.length === 2) {
            throw new Error('Found a source, but no line and column');
          }

          if (segment.length === 3) {
            throw new Error('Found a source and line, but no column');
          }

          cachedSegments[str] = segment;
        }

        // Generated column.
        mapping.generatedColumn = previousGeneratedColumn + segment[0];
        previousGeneratedColumn = mapping.generatedColumn;

        if (segment.length > 1) {
          // Original source.
          mapping.source = previousSource + segment[1];
          previousSource += segment[1];

          // Original line.
          mapping.originalLine = previousOriginalLine + segment[2];
          previousOriginalLine = mapping.originalLine;
          // Lines are stored 0-based
          mapping.originalLine += 1;

          // Original column.
          mapping.originalColumn = previousOriginalColumn + segment[3];
          previousOriginalColumn = mapping.originalColumn;

          if (segment.length > 4) {
            // Original name.
            mapping.name = previousName + segment[4];
            previousName += segment[4];
          }
        }

        generatedMappings.push(mapping);
        if (typeof mapping.originalLine === 'number') {
          originalMappings.push(mapping);
        }
      }
    }

    quickSort(generatedMappings, util.compareByGeneratedPositionsDeflated);
    this.__generatedMappings = generatedMappings;

    quickSort(originalMappings, util.compareByOriginalPositions);
    this.__originalMappings = originalMappings;
  };

/**
 * Find the mapping that best matches the hypothetical "needle" mapping that
 * we are searching for in the given "haystack" of mappings.
 */
BasicSourceMapConsumer.prototype._findMapping =
  function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName,
                                         aColumnName, aComparator, aBias) {
    // To return the position we are searching for, we must first find the
    // mapping for the given position and then return the opposite position it
    // points to. Because the mappings are sorted, we can use binary search to
    // find the best mapping.

    if (aNeedle[aLineName] <= 0) {
      throw new TypeError('Line must be greater than or equal to 1, got '
                          + aNeedle[aLineName]);
    }
    if (aNeedle[aColumnName] < 0) {
      throw new TypeError('Column must be greater than or equal to 0, got '
                          + aNeedle[aColumnName]);
    }

    return binarySearch.search(aNeedle, aMappings, aComparator, aBias);
  };

/**
 * Compute the last column for each generated mapping. The last column is
 * inclusive.
 */
BasicSourceMapConsumer.prototype.computeColumnSpans =
  function SourceMapConsumer_computeColumnSpans() {
    for (var index = 0; index < this._generatedMappings.length; ++index) {
      var mapping = this._generatedMappings[index];

      // Mappings do not contain a field for the last generated columnt. We
      // can come up with an optimistic estimate, however, by assuming that
      // mappings are contiguous (i.e. given two consecutive mappings, the
      // first mapping ends where the second one starts).
      if (index + 1 < this._generatedMappings.length) {
        var nextMapping = this._generatedMappings[index + 1];

        if (mapping.generatedLine === nextMapping.generatedLine) {
          mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
          continue;
        }
      }

      // The last mapping for each line spans the entire line.
      mapping.lastGeneratedColumn = Infinity;
    }
  };

/**
 * Returns the original source, line, and column information for the generated
 * source's line and column positions provided. The only argument is an object
 * with the following properties:
 *
 *   - line: The line number in the generated source.
 *   - column: The column number in the generated source.
 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
 *
 * and an object is returned with the following properties:
 *
 *   - source: The original source file, or null.
 *   - line: The line number in the original source, or null.
 *   - column: The column number in the original source, or null.
 *   - name: The original identifier, or null.
 */
BasicSourceMapConsumer.prototype.originalPositionFor =
  function SourceMapConsumer_originalPositionFor(aArgs) {
    var needle = {
      generatedLine: util.getArg(aArgs, 'line'),
      generatedColumn: util.getArg(aArgs, 'column')
    };

    var index = this._findMapping(
      needle,
      this._generatedMappings,
      "generatedLine",
      "generatedColumn",
      util.compareByGeneratedPositionsDeflated,
      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
    );

    if (index >= 0) {
      var mapping = this._generatedMappings[index];

      if (mapping.generatedLine === needle.generatedLine) {
        var source = util.getArg(mapping, 'source', null);
        if (source !== null) {
          source = this._sources.at(source);
          if (this.sourceRoot != null) {
            source = util.join(this.sourceRoot, source);
          }
        }
        var name = util.getArg(mapping, 'name', null);
        if (name !== null) {
          name = this._names.at(name);
        }
        return {
          source: source,
          line: util.getArg(mapping, 'originalLine', null),
          column: util.getArg(mapping, 'originalColumn', null),
          name: name
        };
      }
    }

    return {
      source: null,
      line: null,
      column: null,
      name: null
    };
  };

/**
 * Return true if we have the source content for every source in the source
 * map, false otherwise.
 */
BasicSourceMapConsumer.prototype.hasContentsOfAllSources =
  function BasicSourceMapConsumer_hasContentsOfAllSources() {
    if (!this.sourcesContent) {
      return false;
    }
    return this.sourcesContent.length >= this._sources.size() &&
      !this.sourcesContent.some(function (sc) { return sc == null; });
  };

/**
 * Returns the original source content. The only argument is the url of the
 * original source file. Returns null if no original source content is
 * available.
 */
BasicSourceMapConsumer.prototype.sourceContentFor =
  function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
    if (!this.sourcesContent) {
      return null;
    }

    if (this.sourceRoot != null) {
      aSource = util.relative(this.sourceRoot, aSource);
    }

    if (this._sources.has(aSource)) {
      return this.sourcesContent[this._sources.indexOf(aSource)];
    }

    var url;
    if (this.sourceRoot != null
        && (url = util.urlParse(this.sourceRoot))) {
      // XXX: file:// URIs and absolute paths lead to unexpected behavior for
      // many users. We can help them out when they expect file:// URIs to
      // behave like it would if they were running a local HTTP server. See
      // https://bugzilla.mozilla.org/show_bug.cgi?id=885597.
      var fileUriAbsPath = aSource.replace(/^file:\/\//, "");
      if (url.scheme == "file"
          && this._sources.has(fileUriAbsPath)) {
        return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)]
      }

      if ((!url.path || url.path == "/")
          && this._sources.has("/" + aSource)) {
        return this.sourcesContent[this._sources.indexOf("/" + aSource)];
      }
    }

    // This function is used recursively from
    // IndexedSourceMapConsumer.prototype.sourceContentFor. In that case, we
    // don't want to throw if we can't find the source - we just want to
    // return null, so we provide a flag to exit gracefully.
    if (nullOnMissing) {
      return null;
    }
    else {
      throw new Error('"' + aSource + '" is not in the SourceMap.');
    }
  };

/**
 * Returns the generated line and column information for the original source,
 * line, and column positions provided. The only argument is an object with
 * the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.
 *   - column: The column number in the original source.
 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
 *
 * and an object is returned with the following properties:
 *
 *   - line: The line number in the generated source, or null.
 *   - column: The column number in the generated source, or null.
 */
BasicSourceMapConsumer.prototype.generatedPositionFor =
  function SourceMapConsumer_generatedPositionFor(aArgs) {
    var source = util.getArg(aArgs, 'source');
    if (this.sourceRoot != null) {
      source = util.relative(this.sourceRoot, source);
    }
    if (!this._sources.has(source)) {
      return {
        line: null,
        column: null,
        lastColumn: null
      };
    }
    source = this._sources.indexOf(source);

    var needle = {
      source: source,
      originalLine: util.getArg(aArgs, 'line'),
      originalColumn: util.getArg(aArgs, 'column')
    };

    var index = this._findMapping(
      needle,
      this._originalMappings,
      "originalLine",
      "originalColumn",
      util.compareByOriginalPositions,
      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
    );

    if (index >= 0) {
      var mapping = this._originalMappings[index];

      if (mapping.source === needle.source) {
        return {
          line: util.getArg(mapping, 'generatedLine', null),
          column: util.getArg(mapping, 'generatedColumn', null),
          lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
        };
      }
    }

    return {
      line: null,
      column: null,
      lastColumn: null
    };
  };

var BasicSourceMapConsumer_1 = sourceMapConsumer.BasicSourceMapConsumer = BasicSourceMapConsumer;

/**
 * An IndexedSourceMapConsumer instance represents a parsed source map which
 * we can query for information. It differs from BasicSourceMapConsumer in
 * that it takes "indexed" source maps (i.e. ones with a "sections" field) as
 * input.
 *
 * The only parameter is a raw source map (either as a JSON string, or already
 * parsed to an object). According to the spec for indexed source maps, they
 * have the following attributes:
 *
 *   - version: Which version of the source map spec this map is following.
 *   - file: Optional. The generated file this source map is associated with.
 *   - sections: A list of section definitions.
 *
 * Each value under the "sections" field has two fields:
 *   - offset: The offset into the original specified at which this section
 *       begins to apply, defined as an object with a "line" and "column"
 *       field.
 *   - map: A source map definition. This source map could also be indexed,
 *       but doesn't have to be.
 *
 * Instead of the "map" field, it's also possible to have a "url" field
 * specifying a URL to retrieve a source map from, but that's currently
 * unsupported.
 *
 * Here's an example source map, taken from the source map spec[0], but
 * modified to omit a section which uses the "url" field.
 *
 *  {
 *    version : 3,
 *    file: "app.js",
 *    sections: [{
 *      offset: {line:100, column:10},
 *      map: {
 *        version : 3,
 *        file: "section.js",
 *        sources: ["foo.js", "bar.js"],
 *        names: ["src", "maps", "are", "fun"],
 *        mappings: "AAAA,E;;ABCDE;"
 *      }
 *    }],
 *  }
 *
 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.535es3xeprgt
 */
function IndexedSourceMapConsumer(aSourceMap) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
  }

  var version = util.getArg(sourceMap, 'version');
  var sections = util.getArg(sourceMap, 'sections');

  if (version != this._version) {
    throw new Error('Unsupported version: ' + version);
  }

  this._sources = new ArraySet();
  this._names = new ArraySet();

  var lastOffset = {
    line: -1,
    column: 0
  };
  this._sections = sections.map(function (s) {
    if (s.url) {
      // The url field will require support for asynchronicity.
      // See https://github.com/mozilla/source-map/issues/16
      throw new Error('Support for url field in sections not implemented.');
    }
    var offset = util.getArg(s, 'offset');
    var offsetLine = util.getArg(offset, 'line');
    var offsetColumn = util.getArg(offset, 'column');

    if (offsetLine < lastOffset.line ||
        (offsetLine === lastOffset.line && offsetColumn < lastOffset.column)) {
      throw new Error('Section offsets must be ordered and non-overlapping.');
    }
    lastOffset = offset;

    return {
      generatedOffset: {
        // The offset fields are 0-based, but we use 1-based indices when
        // encoding/decoding from VLQ.
        generatedLine: offsetLine + 1,
        generatedColumn: offsetColumn + 1
      },
      consumer: new SourceMapConsumer(util.getArg(s, 'map'))
    }
  });
}

IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;

/**
 * The version of the source mapping spec that we are consuming.
 */
IndexedSourceMapConsumer.prototype._version = 3;

/**
 * The list of original sources.
 */
Object.defineProperty(IndexedSourceMapConsumer.prototype, 'sources', {
  get: function () {
    var sources = [];
    for (var i = 0; i < this._sections.length; i++) {
      for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {
        sources.push(this._sections[i].consumer.sources[j]);
      }
    }
    return sources;
  }
});

/**
 * Returns the original source, line, and column information for the generated
 * source's line and column positions provided. The only argument is an object
 * with the following properties:
 *
 *   - line: The line number in the generated source.
 *   - column: The column number in the generated source.
 *
 * and an object is returned with the following properties:
 *
 *   - source: The original source file, or null.
 *   - line: The line number in the original source, or null.
 *   - column: The column number in the original source, or null.
 *   - name: The original identifier, or null.
 */
IndexedSourceMapConsumer.prototype.originalPositionFor =
  function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
    var needle = {
      generatedLine: util.getArg(aArgs, 'line'),
      generatedColumn: util.getArg(aArgs, 'column')
    };

    // Find the section containing the generated position we're trying to map
    // to an original position.
    var sectionIndex = binarySearch.search(needle, this._sections,
      function(needle, section) {
        var cmp = needle.generatedLine - section.generatedOffset.generatedLine;
        if (cmp) {
          return cmp;
        }

        return (needle.generatedColumn -
                section.generatedOffset.generatedColumn);
      });
    var section = this._sections[sectionIndex];

    if (!section) {
      return {
        source: null,
        line: null,
        column: null,
        name: null
      };
    }

    return section.consumer.originalPositionFor({
      line: needle.generatedLine -
        (section.generatedOffset.generatedLine - 1),
      column: needle.generatedColumn -
        (section.generatedOffset.generatedLine === needle.generatedLine
         ? section.generatedOffset.generatedColumn - 1
         : 0),
      bias: aArgs.bias
    });
  };

/**
 * Return true if we have the source content for every source in the source
 * map, false otherwise.
 */
IndexedSourceMapConsumer.prototype.hasContentsOfAllSources =
  function IndexedSourceMapConsumer_hasContentsOfAllSources() {
    return this._sections.every(function (s) {
      return s.consumer.hasContentsOfAllSources();
    });
  };

/**
 * Returns the original source content. The only argument is the url of the
 * original source file. Returns null if no original source content is
 * available.
 */
IndexedSourceMapConsumer.prototype.sourceContentFor =
  function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];

      var content = section.consumer.sourceContentFor(aSource, true);
      if (content) {
        return content;
      }
    }
    if (nullOnMissing) {
      return null;
    }
    else {
      throw new Error('"' + aSource + '" is not in the SourceMap.');
    }
  };

/**
 * Returns the generated line and column information for the original source,
 * line, and column positions provided. The only argument is an object with
 * the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.
 *   - column: The column number in the original source.
 *
 * and an object is returned with the following properties:
 *
 *   - line: The line number in the generated source, or null.
 *   - column: The column number in the generated source, or null.
 */
IndexedSourceMapConsumer.prototype.generatedPositionFor =
  function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];

      // Only consider this section if the requested source is in the list of
      // sources of the consumer.
      if (section.consumer.sources.indexOf(util.getArg(aArgs, 'source')) === -1) {
        continue;
      }
      var generatedPosition = section.consumer.generatedPositionFor(aArgs);
      if (generatedPosition) {
        var ret = {
          line: generatedPosition.line +
            (section.generatedOffset.generatedLine - 1),
          column: generatedPosition.column +
            (section.generatedOffset.generatedLine === generatedPosition.line
             ? section.generatedOffset.generatedColumn - 1
             : 0)
        };
        return ret;
      }
    }

    return {
      line: null,
      column: null
    };
  };

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
IndexedSourceMapConsumer.prototype._parseMappings =
  function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    this.__generatedMappings = [];
    this.__originalMappings = [];
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];
      var sectionMappings = section.consumer._generatedMappings;
      for (var j = 0; j < sectionMappings.length; j++) {
        var mapping = sectionMappings[j];

        var source = section.consumer._sources.at(mapping.source);
        if (section.consumer.sourceRoot !== null) {
          source = util.join(section.consumer.sourceRoot, source);
        }
        this._sources.add(source);
        source = this._sources.indexOf(source);

        var name = section.consumer._names.at(mapping.name);
        this._names.add(name);
        name = this._names.indexOf(name);

        // The mappings coming from the consumer for the section have
        // generated positions relative to the start of the section, so we
        // need to offset them to be relative to the start of the concatenated
        // generated file.
        var adjustedMapping = {
          source: source,
          generatedLine: mapping.generatedLine +
            (section.generatedOffset.generatedLine - 1),
          generatedColumn: mapping.generatedColumn +
            (section.generatedOffset.generatedLine === mapping.generatedLine
            ? section.generatedOffset.generatedColumn - 1
            : 0),
          originalLine: mapping.originalLine,
          originalColumn: mapping.originalColumn,
          name: name
        };

        this.__generatedMappings.push(adjustedMapping);
        if (typeof adjustedMapping.originalLine === 'number') {
          this.__originalMappings.push(adjustedMapping);
        }
      }
    }

    quickSort(this.__generatedMappings, util.compareByGeneratedPositionsDeflated);
    quickSort(this.__originalMappings, util.compareByOriginalPositions);
  };

var IndexedSourceMapConsumer_1 = sourceMapConsumer.IndexedSourceMapConsumer = IndexedSourceMapConsumer;

(function (module, exports) {
(function(root, factory) {
    'use strict';
    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.

    /* istanbul ignore next */
    if (typeof undefined === 'function' && undefined.amd) {
        undefined('stacktrace-gps', ['source-map', 'stackframe'], factory);
    } else if ('object' === 'object') {
        module.exports = factory(sourceMapConsumer, stackframe$1.exports);
    } else {
        root.StackTraceGPS = factory(root.SourceMap || root.sourceMap, root.StackFrame);
    }
}(commonjsGlobal, function(SourceMap, StackFrame) {
    'use strict';

    /**
     * Make a X-Domain request to url and callback.
     *
     * @param {String} url
     * @returns {Promise} with response text if fulfilled
     */
    function _xdr(url) {
        return new Promise(function(resolve, reject) {
            var req = new XMLHttpRequest();
            req.open('get', url);
            req.onerror = reject;
            req.onreadystatechange = function onreadystatechange() {
                if (req.readyState === 4) {
                    if ((req.status >= 200 && req.status < 300) ||
                        (url.substr(0, 7) === 'file://' && req.responseText)) {
                        resolve(req.responseText);
                    } else {
                        reject(new Error('HTTP status: ' + req.status + ' retrieving ' + url));
                    }
                }
            };
            req.send();
        });

    }

    /**
     * Convert a Base64-encoded string into its original representation.
     * Used for inline sourcemaps.
     *
     * @param {String} b64str Base-64 encoded string
     * @returns {String} original representation of the base64-encoded string.
     */
    function _atob(b64str) {
        if (typeof window !== 'undefined' && window.atob) {
            return window.atob(b64str);
        } else {
            throw new Error('You must supply a polyfill for window.atob in this environment');
        }
    }

    function _parseJson(string) {
        if (typeof JSON !== 'undefined' && JSON.parse) {
            return JSON.parse(string);
        } else {
            throw new Error('You must supply a polyfill for JSON.parse in this environment');
        }
    }

    function _findFunctionName(source, lineNumber/*, columnNumber*/) {
        var syntaxes = [
            // {name} = function ({args}) TODO args capture
            /['"]?([$_A-Za-z][$_A-Za-z0-9]*)['"]?\s*[:=]\s*function\b/,
            // function {name}({args}) m[1]=name m[2]=args
            /function\s+([^('"`]*?)\s*\(([^)]*)\)/,
            // {name} = eval()
            /['"]?([$_A-Za-z][$_A-Za-z0-9]*)['"]?\s*[:=]\s*(?:eval|new Function)\b/,
            // fn_name() {
            /\b(?!(?:if|for|switch|while|with|catch)\b)(?:(?:static)\s+)?(\S+)\s*\(.*?\)\s*\{/,
            // {name} = () => {
            /['"]?([$_A-Za-z][$_A-Za-z0-9]*)['"]?\s*[:=]\s*\(.*?\)\s*=>/
        ];
        var lines = source.split('\n');

        // Walk backwards in the source lines until we find the line which matches one of the patterns above
        var code = '';
        var maxLines = Math.min(lineNumber, 20);
        for (var i = 0; i < maxLines; ++i) {
            // lineNo is 1-based, source[] is 0-based
            var line = lines[lineNumber - i - 1];
            var commentPos = line.indexOf('//');
            if (commentPos >= 0) {
                line = line.substr(0, commentPos);
            }

            if (line) {
                code = line + code;
                var len = syntaxes.length;
                for (var index = 0; index < len; index++) {
                    var m = syntaxes[index].exec(code);
                    if (m && m[1]) {
                        return m[1];
                    }
                }
            }
        }
        return undefined;
    }

    function _ensureSupportedEnvironment() {
        if (typeof Object.defineProperty !== 'function' || typeof Object.create !== 'function') {
            throw new Error('Unable to consume source maps in older browsers');
        }
    }

    function _ensureStackFrameIsLegit(stackframe) {
        if (typeof stackframe !== 'object') {
            throw new TypeError('Given StackFrame is not an object');
        } else if (typeof stackframe.fileName !== 'string') {
            throw new TypeError('Given file name is not a String');
        } else if (typeof stackframe.lineNumber !== 'number' ||
            stackframe.lineNumber % 1 !== 0 ||
            stackframe.lineNumber < 1) {
            throw new TypeError('Given line number must be a positive integer');
        } else if (typeof stackframe.columnNumber !== 'number' ||
            stackframe.columnNumber % 1 !== 0 ||
            stackframe.columnNumber < 0) {
            throw new TypeError('Given column number must be a non-negative integer');
        }
        return true;
    }

    function _findSourceMappingURL(source) {
        var sourceMappingUrlRegExp = /\/\/[#@] ?sourceMappingURL=([^\s'"]+)\s*$/mg;
        var lastSourceMappingUrl;
        var matchSourceMappingUrl;
        // eslint-disable-next-line no-cond-assign
        while (matchSourceMappingUrl = sourceMappingUrlRegExp.exec(source)) {
            lastSourceMappingUrl = matchSourceMappingUrl[1];
        }
        if (lastSourceMappingUrl) {
            return lastSourceMappingUrl;
        } else {
            throw new Error('sourceMappingURL not found');
        }
    }

    function _extractLocationInfoFromSourceMapSource(stackframe, sourceMapConsumer, sourceCache) {
        return new Promise(function(resolve, reject) {
            var loc = sourceMapConsumer.originalPositionFor({
                line: stackframe.lineNumber,
                column: stackframe.columnNumber
            });

            if (loc.source) {
                // cache mapped sources
                var mappedSource = sourceMapConsumer.sourceContentFor(loc.source);
                if (mappedSource) {
                    sourceCache[loc.source] = mappedSource;
                }

                resolve(
                    // given stackframe and source location, update stackframe
                    new StackFrame({
                        functionName: loc.name || stackframe.functionName,
                        args: stackframe.args,
                        fileName: loc.source,
                        lineNumber: loc.line,
                        columnNumber: loc.column
                    }));
            } else {
                reject(new Error('Could not get original source for given stackframe and source map'));
            }
        });
    }

    /**
     * @constructor
     * @param {Object} opts
     *      opts.sourceCache = {url: "Source String"} => preload source cache
     *      opts.sourceMapConsumerCache = {/path/file.js.map: SourceMapConsumer}
     *      opts.offline = True to prevent network requests.
     *              Best effort without sources or source maps.
     *      opts.ajax = Promise returning function to make X-Domain requests
     */
    return function StackTraceGPS(opts) {
        if (!(this instanceof StackTraceGPS)) {
            return new StackTraceGPS(opts);
        }
        opts = opts || {};

        this.sourceCache = opts.sourceCache || {};
        this.sourceMapConsumerCache = opts.sourceMapConsumerCache || {};

        this.ajax = opts.ajax || _xdr;

        this._atob = opts.atob || _atob;

        this._get = function _get(location) {
            return new Promise(function(resolve, reject) {
                var isDataUrl = location.substr(0, 5) === 'data:';
                if (this.sourceCache[location]) {
                    resolve(this.sourceCache[location]);
                } else if (opts.offline && !isDataUrl) {
                    reject(new Error('Cannot make network requests in offline mode'));
                } else {
                    if (isDataUrl) {
                        // data URLs can have parameters.
                        // see http://tools.ietf.org/html/rfc2397
                        var supportedEncodingRegexp =
                            /^data:application\/json;([\w=:"-]+;)*base64,/;
                        var match = location.match(supportedEncodingRegexp);
                        if (match) {
                            var sourceMapStart = match[0].length;
                            var encodedSource = location.substr(sourceMapStart);
                            var source = this._atob(encodedSource);
                            this.sourceCache[location] = source;
                            resolve(source);
                        } else {
                            reject(new Error('The encoding of the inline sourcemap is not supported'));
                        }
                    } else {
                        var xhrPromise = this.ajax(location, {method: 'get'});
                        // Cache the Promise to prevent duplicate in-flight requests
                        this.sourceCache[location] = xhrPromise;
                        xhrPromise.then(resolve, reject);
                    }
                }
            }.bind(this));
        };

        /**
         * Creating SourceMapConsumers is expensive, so this wraps the creation of a
         * SourceMapConsumer in a per-instance cache.
         *
         * @param {String} sourceMappingURL = URL to fetch source map from
         * @param {String} defaultSourceRoot = Default source root for source map if undefined
         * @returns {Promise} that resolves a SourceMapConsumer
         */
        this._getSourceMapConsumer = function _getSourceMapConsumer(sourceMappingURL, defaultSourceRoot) {
            return new Promise(function(resolve) {
                if (this.sourceMapConsumerCache[sourceMappingURL]) {
                    resolve(this.sourceMapConsumerCache[sourceMappingURL]);
                } else {
                    var sourceMapConsumerPromise = new Promise(function(resolve, reject) {
                        return this._get(sourceMappingURL).then(function(sourceMapSource) {
                            if (typeof sourceMapSource === 'string') {
                                sourceMapSource = _parseJson(sourceMapSource.replace(/^\)\]\}'/, ''));
                            }
                            if (typeof sourceMapSource.sourceRoot === 'undefined') {
                                sourceMapSource.sourceRoot = defaultSourceRoot;
                            }

                            resolve(new SourceMap.SourceMapConsumer(sourceMapSource));
                        }, reject);
                    }.bind(this));
                    this.sourceMapConsumerCache[sourceMappingURL] = sourceMapConsumerPromise;
                    resolve(sourceMapConsumerPromise);
                }
            }.bind(this));
        };

        /**
         * Given a StackFrame, enhance function name and use source maps for a
         * better StackFrame.
         *
         * @param {StackFrame} stackframe object
         * @returns {Promise} that resolves with with source-mapped StackFrame
         */
        this.pinpoint = function StackTraceGPS$$pinpoint(stackframe) {
            return new Promise(function(resolve, reject) {
                this.getMappedLocation(stackframe).then(function(mappedStackFrame) {
                    function resolveMappedStackFrame() {
                        resolve(mappedStackFrame);
                    }

                    this.findFunctionName(mappedStackFrame)
                        .then(resolve, resolveMappedStackFrame)
                        // eslint-disable-next-line no-unexpected-multiline
                        ['catch'](resolveMappedStackFrame);
                }.bind(this), reject);
            }.bind(this));
        };

        /**
         * Given a StackFrame, guess function name from location information.
         *
         * @param {StackFrame} stackframe
         * @returns {Promise} that resolves with enhanced StackFrame.
         */
        this.findFunctionName = function StackTraceGPS$$findFunctionName(stackframe) {
            return new Promise(function(resolve, reject) {
                _ensureStackFrameIsLegit(stackframe);
                this._get(stackframe.fileName).then(function getSourceCallback(source) {
                    var lineNumber = stackframe.lineNumber;
                    var columnNumber = stackframe.columnNumber;
                    var guessedFunctionName = _findFunctionName(source, lineNumber, columnNumber);
                    // Only replace functionName if we found something
                    if (guessedFunctionName) {
                        resolve(new StackFrame({
                            functionName: guessedFunctionName,
                            args: stackframe.args,
                            fileName: stackframe.fileName,
                            lineNumber: lineNumber,
                            columnNumber: columnNumber
                        }));
                    } else {
                        resolve(stackframe);
                    }
                }, reject)['catch'](reject);
            }.bind(this));
        };

        /**
         * Given a StackFrame, seek source-mapped location and return new enhanced StackFrame.
         *
         * @param {StackFrame} stackframe
         * @returns {Promise} that resolves with enhanced StackFrame.
         */
        this.getMappedLocation = function StackTraceGPS$$getMappedLocation(stackframe) {
            return new Promise(function(resolve, reject) {
                _ensureSupportedEnvironment();
                _ensureStackFrameIsLegit(stackframe);

                var sourceCache = this.sourceCache;
                var fileName = stackframe.fileName;
                this._get(fileName).then(function(source) {
                    var sourceMappingURL = _findSourceMappingURL(source);
                    var isDataUrl = sourceMappingURL.substr(0, 5) === 'data:';
                    var defaultSourceRoot = fileName.substring(0, fileName.lastIndexOf('/') + 1);

                    if (sourceMappingURL[0] !== '/' && !isDataUrl && !(/^https?:\/\/|^\/\//i).test(sourceMappingURL)) {
                        sourceMappingURL = defaultSourceRoot + sourceMappingURL;
                    }

                    return this._getSourceMapConsumer(sourceMappingURL, defaultSourceRoot)
                        .then(function(sourceMapConsumer) {
                            return _extractLocationInfoFromSourceMapSource(stackframe, sourceMapConsumer, sourceCache)
                                .then(resolve)['catch'](function() {
                                    resolve(stackframe);
                                });
                        });
                }.bind(this), reject)['catch'](reject);
            }.bind(this));
        };
    };
}));
}(stacktraceGps$1, stacktraceGps$1.exports));

var stacktraceGps = stacktraceGps$1.exports;

(function (module, exports) {
(function(root, factory) {
    'use strict';
    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.

    /* istanbul ignore next */
    if (typeof undefined === 'function' && undefined.amd) {
        undefined('stacktrace', ['error-stack-parser', 'stack-generator', 'stacktrace-gps'], factory);
    } else if ('object' === 'object') {
        module.exports = factory(errorStackParser$1.exports, stackGenerator$1.exports, stacktraceGps$1.exports);
    } else {
        root.StackTrace = factory(root.ErrorStackParser, root.StackGenerator, root.StackTraceGPS);
    }
}(commonjsGlobal, function StackTrace(ErrorStackParser, StackGenerator, StackTraceGPS) {
    var _options = {
        filter: function(stackframe) {
            // Filter out stackframes for this library by default
            return (stackframe.functionName || '').indexOf('StackTrace$$') === -1 &&
                (stackframe.functionName || '').indexOf('ErrorStackParser$$') === -1 &&
                (stackframe.functionName || '').indexOf('StackTraceGPS$$') === -1 &&
                (stackframe.functionName || '').indexOf('StackGenerator$$') === -1;
        },
        sourceCache: {}
    };

    var _generateError = function StackTrace$$GenerateError() {
        try {
            // Error must be thrown to get stack in IE
            throw new Error();
        } catch (err) {
            return err;
        }
    };

    /**
     * Merge 2 given Objects. If a conflict occurs the second object wins.
     * Does not do deep merges.
     *
     * @param {Object} first base object
     * @param {Object} second overrides
     * @returns {Object} merged first and second
     * @private
     */
    function _merge(first, second) {
        var target = {};

        [first, second].forEach(function(obj) {
            for (var prop in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                    target[prop] = obj[prop];
                }
            }
            return target;
        });

        return target;
    }

    function _isShapedLikeParsableError(err) {
        return err.stack || err['opera#sourceloc'];
    }

    function _filtered(stackframes, filter) {
        if (typeof filter === 'function') {
            return stackframes.filter(filter);
        }
        return stackframes;
    }

    return {
        /**
         * Get a backtrace from invocation point.
         *
         * @param {Object} opts
         * @returns {Array} of StackFrame
         */
        get: function StackTrace$$get(opts) {
            var err = _generateError();
            return _isShapedLikeParsableError(err) ? this.fromError(err, opts) : this.generateArtificially(opts);
        },

        /**
         * Get a backtrace from invocation point.
         * IMPORTANT: Does not handle source maps or guess function names!
         *
         * @param {Object} opts
         * @returns {Array} of StackFrame
         */
        getSync: function StackTrace$$getSync(opts) {
            opts = _merge(_options, opts);
            var err = _generateError();
            var stack = _isShapedLikeParsableError(err) ? ErrorStackParser.parse(err) : StackGenerator.backtrace(opts);
            return _filtered(stack, opts.filter);
        },

        /**
         * Given an error object, parse it.
         *
         * @param {Error} error object
         * @param {Object} opts
         * @returns {Promise} for Array[StackFrame}
         */
        fromError: function StackTrace$$fromError(error, opts) {
            opts = _merge(_options, opts);
            var gps = new StackTraceGPS(opts);
            return new Promise(function(resolve) {
                var stackframes = _filtered(ErrorStackParser.parse(error), opts.filter);
                resolve(Promise.all(stackframes.map(function(sf) {
                    return new Promise(function(resolve) {
                        function resolveOriginal() {
                            resolve(sf);
                        }

                        gps.pinpoint(sf).then(resolve, resolveOriginal)['catch'](resolveOriginal);
                    });
                })));
            }.bind(this));
        },

        /**
         * Use StackGenerator to generate a backtrace.
         *
         * @param {Object} opts
         * @returns {Promise} of Array[StackFrame]
         */
        generateArtificially: function StackTrace$$generateArtificially(opts) {
            opts = _merge(_options, opts);
            var stackFrames = StackGenerator.backtrace(opts);
            if (typeof opts.filter === 'function') {
                stackFrames = stackFrames.filter(opts.filter);
            }
            return Promise.resolve(stackFrames);
        },

        /**
         * Given a function, wrap it such that invocations trigger a callback that
         * is called with a stack trace.
         *
         * @param {Function} fn to be instrumented
         * @param {Function} callback function to call with a stack trace on invocation
         * @param {Function} errback optional function to call with error if unable to get stack trace.
         * @param {Object} thisArg optional context object (e.g. window)
         */
        instrument: function StackTrace$$instrument(fn, callback, errback, thisArg) {
            if (typeof fn !== 'function') {
                throw new Error('Cannot instrument non-function object');
            } else if (typeof fn.__stacktraceOriginalFn === 'function') {
                // Already instrumented, return given Function
                return fn;
            }

            var instrumented = function StackTrace$$instrumented() {
                try {
                    this.get().then(callback, errback)['catch'](errback);
                    return fn.apply(thisArg || this, arguments);
                } catch (e) {
                    if (_isShapedLikeParsableError(e)) {
                        this.fromError(e).then(callback, errback)['catch'](errback);
                    }
                    throw e;
                }
            }.bind(this);
            instrumented.__stacktraceOriginalFn = fn;

            return instrumented;
        },

        /**
         * Given a function that has been instrumented,
         * revert the function to it's original (non-instrumented) state.
         *
         * @param {Function} fn to de-instrument
         */
        deinstrument: function StackTrace$$deinstrument(fn) {
            if (typeof fn !== 'function') {
                throw new Error('Cannot de-instrument non-function object');
            } else if (typeof fn.__stacktraceOriginalFn === 'function') {
                return fn.__stacktraceOriginalFn;
            } else {
                // Function not instrumented, return original
                return fn;
            }
        },

        /**
         * Given an error message and Array of StackFrames, serialize and POST to given URL.
         *
         * @param {Array} stackframes
         * @param {String} url
         * @param {String} errorMsg
         * @param {Object} requestOptions
         */
        report: function StackTrace$$report(stackframes, url, errorMsg, requestOptions) {
            return new Promise(function(resolve, reject) {
                var req = new XMLHttpRequest();
                req.onerror = reject;
                req.onreadystatechange = function onreadystatechange() {
                    if (req.readyState === 4) {
                        if (req.status >= 200 && req.status < 400) {
                            resolve(req.responseText);
                        } else {
                            reject(new Error('POST to ' + url + ' failed with status: ' + req.status));
                        }
                    }
                };
                req.open('post', url);

                // Set request headers
                req.setRequestHeader('Content-Type', 'application/json');
                if (requestOptions && typeof requestOptions.headers === 'object') {
                    var headers = requestOptions.headers;
                    for (var header in headers) {
                        if (Object.prototype.hasOwnProperty.call(headers, header)) {
                            req.setRequestHeader(header, headers[header]);
                        }
                    }
                }

                var reportPayload = {stack: stackframes};
                if (errorMsg !== undefined && errorMsg !== null) {
                    reportPayload.message = errorMsg;
                }

                req.send(JSON.stringify(reportPayload));
            });
        }
    };
}));
}(stacktrace, stacktrace.exports));

var StackTrace = stacktrace.exports;

const _ = undefined;
// any types are because the type defs are in svelte files
// which ts kinda doesn't wanna touch properly
class Contexts {
    // initializing everything to undefined else typescript will strip them
    static '*' = _;
    static globalAppBar = _;
    static globalHamburger = _;
    static globalToasts = _;
    static isRouting = _;
    static isSceneOutAnimationRunning = _;
    static isSceneInAnimationRunning = _;
    static isOutAnimationRunning = _;
    static isInAnimationRunning = _;
    static incompatibleReason = _;
}
class Ctx extends Contexts {
    static BROADCAST_KEY = '*';
    static items = {};
    static s = {};
    static getStore(key) {
        key ??= this.getCaller();
        if (this.items[key] == null) {
            this.items[key] = new Store(undefined);
        }
        return this.items[key];
    }
    static get(key) {
        return this.getStore(key)?.value;
    }
    static set(key, value) {
        key = this.getKey(key);
        if (this.items[key] == null) {
            this.items[key] = new Store(value);
            return;
        }
        this.items[key].set(value);
    }
    static getCaller() {
        const stackFrames = StackTrace.getSync();
        for (let i = 0, l = stackFrames.length; i < l; ++i) {
            const { functionName } = stackFrames[i];
            const NEW_PREFIX = 'new ';
            if (functionName?.indexOf(NEW_PREFIX) === 0
                && functionName?.indexOf(Ctx.name) === -1) {
                return functionName.substr(NEW_PREFIX.length);
            }
        }
        throw new UnexpectedValueError('Wasn\'t able to get function caller');
    }
    static getKey(from) {
        return typeof from === 'function' ? from.name : String(from);
    }
}
Object.keys(Contexts).forEach((contextKey) => {
    Object.defineProperty(Ctx, contextKey, {
        get() {
            return Ctx.get(contextKey);
        },
        set(value) {
            Ctx.set(contextKey, value);
        },
    });
    Object.defineProperty(Ctx.s, contextKey, {
        get() {
            return Ctx.getStore(contextKey);
        },
        // set(value) {
        // 	Ctx.items[contextKey] = value;
        // },
    });
});

class Shadow {
    static apply(depth, node) {
        if (node == null) {
            throw new UnexpectedValueError('node is nullish');
        }
        const processedBoxShadow = this.get(depth);
        node
            .style
            .setProperty('--shadow', processedBoxShadow.active);
        node
            .style
            .setProperty('--shadow-inactive', processedBoxShadow.inactive);
    }
    static get(depth) {
        const isDrop = depth > 0;
        const boxShadowProperty = isDrop
            ? '--box-shadow-drop'
            : '--box-shadow-inner';
        const boxShadow = getComputedStyle(document.documentElement)
            .getPropertyValue(boxShadowProperty)
            .trim();
        const boxShadowParts = boxShadow.includes('rgba(') || boxShadow.includes('hsla(')
            ? boxShadow
                .replace(/\)\s*,/g, ')__delim__')
                .split('__delim__')
            : boxShadow
                .split(',');
        const blur = Math.abs(depth) * 20;
        const darkX = blur / 3;
        const darkY = darkX;
        const brightX = -darkX;
        const brightY = brightX;
        const rgba = boxShadowParts.map((boxShadowPart) => {
            const indexOfRGBA = boxShadowPart
                .trim()
                .indexOf('rgba(');
            const indexOfHSLA = boxShadowPart
                .trim()
                .indexOf('hsla(');
            const workingRgba = boxShadowPart
                .trim()
                .substr(indexOfRGBA < 0
                ? indexOfHSLA
                : indexOfRGBA);
            const alpha = Number.parseFloat(workingRgba
                .substring(workingRgba.lastIndexOf(',') + 1, workingRgba.lastIndexOf(')'))
                .trim()) * (Math.abs(depth) / 3);
            return `${workingRgba.substr(0, workingRgba.lastIndexOf(',') + 1)} ${alpha})`;
        });
        const darkBoxShadowParts = this.getParts(darkX, darkY, blur, rgba[0]);
        const darkBoxShadowPartsInactive = this.getParts(0, 0, 0, rgba[0]);
        const brightBoxShadowParts = this.getParts(brightX, brightY, blur, rgba[1]);
        const brightBoxShadowPartsInactive = this.getParts(0, 0, 0, rgba[1]);
        const processedBoxShadow = {
            active: this.getProcessedBoxShadow(isDrop, darkBoxShadowParts, brightBoxShadowParts),
            inactive: this.getProcessedBoxShadow(isDrop, darkBoxShadowPartsInactive, brightBoxShadowPartsInactive),
        };
        return processedBoxShadow;
    }
    static getParts(x, y, blur, rgba) {
        return [
            `${x}px`,
            `${y}px`,
            `${blur}px`,
            rgba,
        ];
    }
    static getProcessedBoxShadow(isDrop, darkBoxShadowParts, brightBoxShadowParts) {
        return `${isDrop ? '' : 'inset'} ${darkBoxShadowParts.join(' ')}, ${isDrop ? '' : 'inset'} ${brightBoxShadowParts.join(' ')}`;
    }
}

/*
Adapted from https://github.com/mattdesl
Distributed under MIT License https://github.com/mattdesl/eases/blob/master/LICENSE.md
*/
function backInOut(t) {
    const s = 1.70158 * 1.525;
    if ((t *= 2) < 1)
        return 0.5 * (t * t * ((s + 1) * t - s));
    return 0.5 * ((t -= 2) * t * ((s + 1) * t + s) + 2);
}
function backIn(t) {
    const s = 1.70158;
    return t * t * ((s + 1) * t - s);
}
function backOut(t) {
    const s = 1.70158;
    return --t * t * ((s + 1) * t + s) + 1;
}
function bounceOut(t) {
    const a = 4.0 / 11.0;
    const b = 8.0 / 11.0;
    const c = 9.0 / 10.0;
    const ca = 4356.0 / 361.0;
    const cb = 35442.0 / 1805.0;
    const cc = 16061.0 / 1805.0;
    const t2 = t * t;
    return t < a
        ? 7.5625 * t2
        : t < b
            ? 9.075 * t2 - 9.9 * t + 3.4
            : t < c
                ? ca * t2 - cb * t + cc
                : 10.8 * t * t - 20.52 * t + 10.72;
}
function bounceInOut(t) {
    return t < 0.5
        ? 0.5 * (1.0 - bounceOut(1.0 - t * 2.0))
        : 0.5 * bounceOut(t * 2.0 - 1.0) + 0.5;
}
function bounceIn(t) {
    return 1.0 - bounceOut(1.0 - t);
}
function circInOut(t) {
    if ((t *= 2) < 1)
        return -0.5 * (Math.sqrt(1 - t * t) - 1);
    return 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
}
function circIn(t) {
    return 1.0 - Math.sqrt(1.0 - t * t);
}
function circOut(t) {
    return Math.sqrt(1 - --t * t);
}
function cubicInOut(t) {
    return t < 0.5 ? 4.0 * t * t * t : 0.5 * Math.pow(2.0 * t - 2.0, 3.0) + 1.0;
}
function cubicIn(t) {
    return t * t * t;
}
function cubicOut(t) {
    const f = t - 1.0;
    return f * f * f + 1.0;
}
function elasticInOut(t) {
    return t < 0.5
        ? 0.5 *
            Math.sin(((+13.0 * Math.PI) / 2) * 2.0 * t) *
            Math.pow(2.0, 10.0 * (2.0 * t - 1.0))
        : 0.5 *
            Math.sin(((-13.0 * Math.PI) / 2) * (2.0 * t - 1.0 + 1.0)) *
            Math.pow(2.0, -10.0 * (2.0 * t - 1.0)) +
            1.0;
}
function elasticIn(t) {
    return Math.sin((13.0 * t * Math.PI) / 2) * Math.pow(2.0, 10.0 * (t - 1.0));
}
function elasticOut(t) {
    return (Math.sin((-13.0 * (t + 1.0) * Math.PI) / 2) * Math.pow(2.0, -10.0 * t) + 1.0);
}
function expoInOut(t) {
    return t === 0.0 || t === 1.0
        ? t
        : t < 0.5
            ? +0.5 * Math.pow(2.0, 20.0 * t - 10.0)
            : -0.5 * Math.pow(2.0, 10.0 - t * 20.0) + 1.0;
}
function expoIn(t) {
    return t === 0.0 ? t : Math.pow(2.0, 10.0 * (t - 1.0));
}
function expoOut(t) {
    return t === 1.0 ? t : 1.0 - Math.pow(2.0, -10.0 * t);
}
function quadInOut(t) {
    t /= 0.5;
    if (t < 1)
        return 0.5 * t * t;
    t--;
    return -0.5 * (t * (t - 2) - 1);
}
function quadIn(t) {
    return t * t;
}
function quadOut(t) {
    return -t * (t - 2.0);
}
function quartInOut(t) {
    return t < 0.5
        ? +8.0 * Math.pow(t, 4.0)
        : -8.0 * Math.pow(t - 1.0, 4.0) + 1.0;
}
function quartIn(t) {
    return Math.pow(t, 4.0);
}
function quartOut(t) {
    return Math.pow(t - 1.0, 3.0) * (1.0 - t) + 1.0;
}
function quintInOut(t) {
    if ((t *= 2) < 1)
        return 0.5 * t * t * t * t * t;
    return 0.5 * ((t -= 2) * t * t * t * t + 2);
}
function quintIn(t) {
    return t * t * t * t * t;
}
function quintOut(t) {
    return --t * t * t * t * t + 1;
}
function sineInOut(t) {
    return -0.5 * (Math.cos(Math.PI * t) - 1);
}
function sineIn(t) {
    const v = Math.cos(t * Math.PI * 0.5);
    if (Math.abs(v) < 1e-14)
        return 1;
    else
        return 1 - v;
}
function sineOut(t) {
    return Math.sin((t * Math.PI) / 2);
}

function is_date(obj) {
    return Object.prototype.toString.call(obj) === '[object Date]';
}

function tick_spring(ctx, last_value, current_value, target_value) {
    if (typeof current_value === 'number' || is_date(current_value)) {
        // @ts-ignore
        const delta = target_value - current_value;
        // @ts-ignore
        const velocity = (current_value - last_value) / (ctx.dt || 1 / 60); // guard div by 0
        const spring = ctx.opts.stiffness * delta;
        const damper = ctx.opts.damping * velocity;
        const acceleration = (spring - damper) * ctx.inv_mass;
        const d = (velocity + acceleration) * ctx.dt;
        if (Math.abs(d) < ctx.opts.precision && Math.abs(delta) < ctx.opts.precision) {
            return target_value; // settled
        }
        else {
            ctx.settled = false; // signal loop to keep ticking
            // @ts-ignore
            return is_date(current_value) ?
                new Date(current_value.getTime() + d) : current_value + d;
        }
    }
    else if (Array.isArray(current_value)) {
        // @ts-ignore
        return current_value.map((_, i) => tick_spring(ctx, last_value[i], current_value[i], target_value[i]));
    }
    else if (typeof current_value === 'object') {
        const next_value = {};
        for (const k in current_value) {
            // @ts-ignore
            next_value[k] = tick_spring(ctx, last_value[k], current_value[k], target_value[k]);
        }
        // @ts-ignore
        return next_value;
    }
    else {
        throw new Error(`Cannot spring ${typeof current_value} values`);
    }
}
function spring(value, opts = {}) {
    const store = writable(value);
    const { stiffness = 0.15, damping = 0.8, precision = 0.01 } = opts;
    let last_time;
    let task;
    let current_token;
    let last_value = value;
    let target_value = value;
    let inv_mass = 1;
    let inv_mass_recovery_rate = 0;
    let cancel_task = false;
    function set(new_value, opts = {}) {
        target_value = new_value;
        const token = current_token = {};
        if (value == null || opts.hard || (spring.stiffness >= 1 && spring.damping >= 1)) {
            cancel_task = true; // cancel any running animation
            last_time = now();
            last_value = new_value;
            store.set(value = target_value);
            return Promise.resolve();
        }
        else if (opts.soft) {
            const rate = opts.soft === true ? .5 : +opts.soft;
            inv_mass_recovery_rate = 1 / (rate * 60);
            inv_mass = 0; // infinite mass, unaffected by spring forces
        }
        if (!task) {
            last_time = now();
            cancel_task = false;
            task = loop(now => {
                if (cancel_task) {
                    cancel_task = false;
                    task = null;
                    return false;
                }
                inv_mass = Math.min(inv_mass + inv_mass_recovery_rate, 1);
                const ctx = {
                    inv_mass,
                    opts: spring,
                    settled: true,
                    dt: (now - last_time) * 60 / 1000
                };
                const next_value = tick_spring(ctx, last_value, value, target_value);
                last_time = now;
                last_value = value;
                store.set(value = next_value);
                if (ctx.settled) {
                    task = null;
                }
                return !ctx.settled;
            });
        }
        return new Promise(fulfil => {
            task.promise.then(() => {
                if (token === current_token)
                    fulfil();
            });
        });
    }
    const spring = {
        set,
        update: (fn, opts) => set(fn(target_value, value), opts),
        subscribe: store.subscribe,
        stiffness,
        damping,
        precision
    };
    return spring;
}

function get_interpolator(a, b) {
    if (a === b || a !== a)
        return () => a;
    const type = typeof a;
    if (type !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
        throw new Error('Cannot interpolate values of different type');
    }
    if (Array.isArray(a)) {
        const arr = b.map((bi, i) => {
            return get_interpolator(a[i], bi);
        });
        return t => arr.map(fn => fn(t));
    }
    if (type === 'object') {
        if (!a || !b)
            throw new Error('Object cannot be null');
        if (is_date(a) && is_date(b)) {
            a = a.getTime();
            b = b.getTime();
            const delta = b - a;
            return t => new Date(a + t * delta);
        }
        const keys = Object.keys(b);
        const interpolators = {};
        keys.forEach(key => {
            interpolators[key] = get_interpolator(a[key], b[key]);
        });
        return t => {
            const result = {};
            keys.forEach(key => {
                result[key] = interpolators[key](t);
            });
            return result;
        };
    }
    if (type === 'number') {
        const delta = b - a;
        return t => a + t * delta;
    }
    throw new Error(`Cannot interpolate ${type} values`);
}
function tweened(value, defaults = {}) {
    const store = writable(value);
    let task;
    let target_value = value;
    function set(new_value, opts) {
        if (value == null) {
            store.set(value = new_value);
            return Promise.resolve();
        }
        target_value = new_value;
        let previous_task = task;
        let started = false;
        let { delay = 0, duration = 400, easing = identity, interpolate = get_interpolator } = assign(assign({}, defaults), opts);
        if (duration === 0) {
            if (previous_task) {
                previous_task.abort();
                previous_task = null;
            }
            store.set(value = target_value);
            return Promise.resolve();
        }
        const start = now() + delay;
        let fn;
        task = loop(now => {
            if (now < start)
                return true;
            if (!started) {
                fn = interpolate(value, new_value);
                if (typeof duration === 'function')
                    duration = duration(value, new_value);
                started = true;
            }
            if (previous_task) {
                previous_task.abort();
                previous_task = null;
            }
            const elapsed = now - start;
            if (elapsed > duration) {
                store.set(value = new_value);
                return false;
            }
            // @ts-ignore
            store.set(value = fn(easing(elapsed / duration)));
            return true;
        });
        return task.promise;
    }
    return {
        set,
        update: (fn, opts) => set(fn(target_value, value), opts),
        subscribe: store.subscribe
    };
}

/* src\ui\blocks\Ripple.svelte generated by Svelte v3.38.2 */
const file$j = "src\\ui\\blocks\\Ripple.svelte";

function create_fragment$j(ctx) {
	let circle;

	const block = {
		c: function create() {
			circle = svg_element("circle");
			set_style(circle, "fill", CSSUtility.parse(/*fill*/ ctx[2]));
			attr_dev(circle, "cx", /*x*/ ctx[0]);
			attr_dev(circle, "cy", /*y*/ ctx[1]);
			attr_dev(circle, "r", /*$rippleSize*/ ctx[3]);
			attr_dev(circle, "opacity", /*$rippleOpacity*/ ctx[4]);
			add_location(circle, file$j, 23, 0, 581);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, circle, anchor);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*fill*/ 4) {
				set_style(circle, "fill", CSSUtility.parse(/*fill*/ ctx[2]));
			}

			if (dirty & /*x*/ 1) {
				attr_dev(circle, "cx", /*x*/ ctx[0]);
			}

			if (dirty & /*y*/ 2) {
				attr_dev(circle, "cy", /*y*/ ctx[1]);
			}

			if (dirty & /*$rippleSize*/ 8) {
				attr_dev(circle, "r", /*$rippleSize*/ ctx[3]);
			}

			if (dirty & /*$rippleOpacity*/ 16) {
				attr_dev(circle, "opacity", /*$rippleOpacity*/ ctx[4]);
			}
		},
		i: noop$1,
		o: noop$1,
		d: function destroy(detaching) {
			if (detaching) detach_dev(circle);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$j.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$j($$self, $$props, $$invalidate) {
	let $rippleSize;
	let $rippleOpacity;
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("Ripple", slots, []);
	
	let { x } = $$props;
	let { y } = $$props;
	let { sizeIn } = $$props;
	let { size } = $$props;
	let { speed } = $$props;
	let { opacityIn } = $$props;
	let { fill } = $$props;
	const rippleSize = tweened(sizeIn, { duration: speed });
	validate_store(rippleSize, "rippleSize");
	component_subscribe($$self, rippleSize, value => $$invalidate(3, $rippleSize = value));

	const rippleOpacity = tweened(opacityIn, {
		duration: speed + speed * 2.5,
		easing: expoOut
	});

	validate_store(rippleOpacity, "rippleOpacity");
	component_subscribe($$self, rippleOpacity, value => $$invalidate(4, $rippleOpacity = value));

	onMount(() => {
		rippleSize.set(size);
		rippleOpacity.set(0);
	});

	const writable_props = ["x", "y", "sizeIn", "size", "speed", "opacityIn", "fill"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Ripple> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ("x" in $$props) $$invalidate(0, x = $$props.x);
		if ("y" in $$props) $$invalidate(1, y = $$props.y);
		if ("sizeIn" in $$props) $$invalidate(7, sizeIn = $$props.sizeIn);
		if ("size" in $$props) $$invalidate(8, size = $$props.size);
		if ("speed" in $$props) $$invalidate(9, speed = $$props.speed);
		if ("opacityIn" in $$props) $$invalidate(10, opacityIn = $$props.opacityIn);
		if ("fill" in $$props) $$invalidate(2, fill = $$props.fill);
	};

	$$self.$capture_state = () => ({
		onMount,
		tweened,
		expoOut,
		CSSUtility,
		x,
		y,
		sizeIn,
		size,
		speed,
		opacityIn,
		fill,
		rippleSize,
		rippleOpacity,
		$rippleSize,
		$rippleOpacity
	});

	$$self.$inject_state = $$props => {
		if ("x" in $$props) $$invalidate(0, x = $$props.x);
		if ("y" in $$props) $$invalidate(1, y = $$props.y);
		if ("sizeIn" in $$props) $$invalidate(7, sizeIn = $$props.sizeIn);
		if ("size" in $$props) $$invalidate(8, size = $$props.size);
		if ("speed" in $$props) $$invalidate(9, speed = $$props.speed);
		if ("opacityIn" in $$props) $$invalidate(10, opacityIn = $$props.opacityIn);
		if ("fill" in $$props) $$invalidate(2, fill = $$props.fill);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		x,
		y,
		fill,
		$rippleSize,
		$rippleOpacity,
		rippleSize,
		rippleOpacity,
		sizeIn,
		size,
		speed,
		opacityIn
	];
}

class Ripple extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$j, create_fragment$j, safe_not_equal, {
			x: 0,
			y: 1,
			sizeIn: 7,
			size: 8,
			speed: 9,
			opacityIn: 10,
			fill: 2
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Ripple",
			options,
			id: create_fragment$j.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*x*/ ctx[0] === undefined && !("x" in props)) {
			console.warn("<Ripple> was created without expected prop 'x'");
		}

		if (/*y*/ ctx[1] === undefined && !("y" in props)) {
			console.warn("<Ripple> was created without expected prop 'y'");
		}

		if (/*sizeIn*/ ctx[7] === undefined && !("sizeIn" in props)) {
			console.warn("<Ripple> was created without expected prop 'sizeIn'");
		}

		if (/*size*/ ctx[8] === undefined && !("size" in props)) {
			console.warn("<Ripple> was created without expected prop 'size'");
		}

		if (/*speed*/ ctx[9] === undefined && !("speed" in props)) {
			console.warn("<Ripple> was created without expected prop 'speed'");
		}

		if (/*opacityIn*/ ctx[10] === undefined && !("opacityIn" in props)) {
			console.warn("<Ripple> was created without expected prop 'opacityIn'");
		}

		if (/*fill*/ ctx[2] === undefined && !("fill" in props)) {
			console.warn("<Ripple> was created without expected prop 'fill'");
		}
	}

	get x() {
		return this.$$.ctx[0];
	}

	set x(x) {
		this.$set({ x });
		flush();
	}

	get y() {
		return this.$$.ctx[1];
	}

	set y(y) {
		this.$set({ y });
		flush();
	}

	get sizeIn() {
		return this.$$.ctx[7];
	}

	set sizeIn(sizeIn) {
		this.$set({ sizeIn });
		flush();
	}

	get size() {
		return this.$$.ctx[8];
	}

	set size(size) {
		this.$set({ size });
		flush();
	}

	get speed() {
		return this.$$.ctx[9];
	}

	set speed(speed) {
		this.$set({ speed });
		flush();
	}

	get opacityIn() {
		return this.$$.ctx[10];
	}

	set opacityIn(opacityIn) {
		this.$set({ opacityIn });
		flush();
	}

	get fill() {
		return this.$$.ctx[2];
	}

	set fill(fill) {
		this.$set({ fill });
		flush();
	}
}

var undefined$i = undefined;

/* src\ui\blocks\Button.svelte generated by Svelte v3.38.2 */

const { Object: Object_1$2 } = globals;
const file$i = "src\\ui\\blocks\\Button.svelte";

function get_each_context$2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[50] = list[i];
	return child_ctx;
}

const get_icon_slot_changes = dirty => ({});
const get_icon_slot_context = ctx => ({});
const get_background_slot_changes$1 = dirty => ({});
const get_background_slot_context$1 = ctx => ({});

// (158:3) {:else}
function create_else_block$2(ctx) {
	let current;
	const default_slot_template = /*#slots*/ ctx[35].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[34], null);

	const block = {
		c: function create() {
			if (default_slot) default_slot.c();
		},
		m: function mount(target, anchor) {
			if (default_slot) {
				default_slot.m(target, anchor);
			}

			current = true;
		},
		p: function update(ctx, dirty) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty[1] & /*$$scope*/ 8)) {
					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[34], dirty, null, null);
				}
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (default_slot) default_slot.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block$2.name,
		type: "else",
		source: "(158:3) {:else}",
		ctx
	});

	return block;
}

// (149:3) {#if isText}
function create_if_block$6(ctx) {
	let icon_1;
	let t;
	let string;
	let current;
	const icon_slot_template = /*#slots*/ ctx[35].icon;
	const icon_slot = create_slot(icon_slot_template, ctx, /*$$scope*/ ctx[34], get_icon_slot_context);
	const icon_slot_or_fallback = icon_slot || fallback_block$4(ctx);
	const default_slot_template = /*#slots*/ ctx[35].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[34], null);

	const block = {
		c: function create() {
			icon_1 = element("icon");
			if (icon_slot_or_fallback) icon_slot_or_fallback.c();
			t = space();
			string = element("string");
			if (default_slot) default_slot.c();
			attr_dev(icon_1, "class", "svelte-1xojph");
			add_location(icon_1, file$i, 149, 4, 5178);
			attr_dev(string, "class", "svelte-1xojph");
			add_location(string, file$i, 154, 4, 5262);
		},
		m: function mount(target, anchor) {
			insert_dev(target, icon_1, anchor);

			if (icon_slot_or_fallback) {
				icon_slot_or_fallback.m(icon_1, null);
			}

			insert_dev(target, t, anchor);
			insert_dev(target, string, anchor);

			if (default_slot) {
				default_slot.m(string, null);
			}

			current = true;
		},
		p: function update(ctx, dirty) {
			if (icon_slot) {
				if (icon_slot.p && (!current || dirty[1] & /*$$scope*/ 8)) {
					update_slot(icon_slot, icon_slot_template, ctx, /*$$scope*/ ctx[34], dirty, get_icon_slot_changes, get_icon_slot_context);
				}
			} else {
				if (icon_slot_or_fallback && icon_slot_or_fallback.p && dirty[0] & /*icon*/ 16) {
					icon_slot_or_fallback.p(ctx, dirty);
				}
			}

			if (default_slot) {
				if (default_slot.p && (!current || dirty[1] & /*$$scope*/ 8)) {
					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[34], dirty, null, null);
				}
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(icon_slot_or_fallback, local);
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(icon_slot_or_fallback, local);
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(icon_1);
			if (icon_slot_or_fallback) icon_slot_or_fallback.d(detaching);
			if (detaching) detach_dev(t);
			if (detaching) detach_dev(string);
			if (default_slot) default_slot.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$6.name,
		type: "if",
		source: "(149:3) {#if isText}",
		ctx
	});

	return block;
}

// (151:23)         
function fallback_block$4(ctx) {
	let t_value = (/*icon*/ ctx[4] ?? "") + "";
	let t;

	const block = {
		c: function create() {
			t = text(t_value);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty[0] & /*icon*/ 16 && t_value !== (t_value = (/*icon*/ ctx[4] ?? "") + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: fallback_block$4.name,
		type: "fallback",
		source: "(151:23)         ",
		ctx
	});

	return block;
}

// (163:3) {#each $ripples as ripple}
function create_each_block$2(ctx) {
	let ripple;
	let current;

	ripple = new Ripple({
			props: {
				x: /*ripple*/ ctx[50].x,
				y: /*ripple*/ ctx[50].y,
				size: /*ripple*/ ctx[50].size,
				speed,
				sizeIn,
				opacityIn,
				fill: /*rippleColour*/ ctx[2]
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(ripple.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(ripple, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const ripple_changes = {};
			if (dirty[0] & /*$ripples*/ 4194304) ripple_changes.x = /*ripple*/ ctx[50].x;
			if (dirty[0] & /*$ripples*/ 4194304) ripple_changes.y = /*ripple*/ ctx[50].y;
			if (dirty[0] & /*$ripples*/ 4194304) ripple_changes.size = /*ripple*/ ctx[50].size;
			if (dirty[0] & /*rippleColour*/ 4) ripple_changes.fill = /*rippleColour*/ ctx[2];
			ripple.$set(ripple_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(ripple.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(ripple.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(ripple, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$2.name,
		type: "each",
		source: "(163:3) {#each $ripples as ripple}",
		ctx
	});

	return block;
}

function create_fragment$i(ctx) {
	let component;
	let container;
	let t0;
	let button_1;
	let span;
	let current_block_type_index;
	let if_block;
	let t1;
	let svg;
	let current;
	let mounted;
	let dispose;
	const background_slot_template = /*#slots*/ ctx[35].background;
	const background_slot = create_slot(background_slot_template, ctx, /*$$scope*/ ctx[34], get_background_slot_context$1);
	const if_block_creators = [create_if_block$6, create_else_block$2];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*isText*/ ctx[9]) return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx, [-1]);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
	let each_value = /*$ripples*/ ctx[22];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	const block = {
		c: function create() {
			component = element("component");
			container = element("container");
			if (background_slot) background_slot.c();
			t0 = space();
			button_1 = element("button");
			span = element("span");
			if_block.c();
			t1 = space();
			svg = svg_element("svg");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(container, "class", "background svelte-1xojph");
			add_location(container, file$i, 120, 1, 4027);
			attr_dev(span, "class", "content svelte-1xojph");
			add_location(span, file$i, 147, 2, 5133);
			attr_dev(svg, "class", "svelte-1xojph");
			add_location(svg, file$i, 161, 2, 5362);
			set_style(button_1, "--colour-background", CSSUtility.parse(/*backgroundColour*/ ctx[0]));

			set_style(button_1, "--colour-hover", CSSUtility.parse(/*$isAnimatedW*/ ctx[19]
			? /*hoverColour*/ ctx[1]
			: /*backgroundColour*/ ctx[0]));

			set_style(button_1, "--colour-ripple", CSSUtility.parse(/*rippleColour*/ ctx[2]));

			set_style(button_1, "--colour-text", CSSUtility.parse(/*$isTextInvertedAgainstBackgroundW*/ ctx[20]
			? "white"
			: /*textColour*/ ctx[3]));

			set_style(button_1, "--button-padding", CSSUtility.parse(/*padding*/ ctx[11]));
			set_style(button_1, "--icon-size", CSSUtility.parse(/*iconSize*/ ctx[5]));
			set_style(button_1, "--text-align", /*textAlign*/ ctx[10]);

			set_style(button_1, "--transition", /*$isAnimatedW*/ ctx[19]
			? "0.2s var(--ease-slow-slow)"
			: "unset");

			set_style(button_1, "--mix-blend-mode", /*$isTextInvertedAgainstBackgroundW*/ ctx[20]
			? "difference"
			: "unset");

			button_1.disabled = /*$isDisabledW*/ ctx[21];
			attr_dev(button_1, "class", "svelte-1xojph");
			add_location(button_1, file$i, 125, 1, 4111);
			set_style(component, "--width", CSSUtility.parse(/*width*/ ctx[6]));
			set_style(component, "--height", CSSUtility.parse(/*height*/ ctx[8]));
			set_style(component, "--border-radius", CSSUtility.parse(/*roundness*/ ctx[7]));
			attr_dev(component, "class", "svelte-1xojph");
			toggle_class(component, "unpressed", !/*$isFocusedW*/ ctx[18]);
			add_location(component, file$i, 111, 0, 3799);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, component, anchor);
			append_dev(component, container);

			if (background_slot) {
				background_slot.m(container, null);
			}

			append_dev(component, t0);
			append_dev(component, button_1);
			append_dev(button_1, span);
			if_blocks[current_block_type_index].m(span, null);
			append_dev(button_1, t1);
			append_dev(button_1, svg);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(svg, null);
			}

			/*button_1_binding*/ ctx[36](button_1);
			/*component_binding*/ ctx[44](component);
			current = true;

			if (!mounted) {
				dispose = [
					listen_dev(button_1, "click", /*click_handler*/ ctx[37], false, false, false),
					listen_dev(button_1, "focus", /*focus_handler*/ ctx[38], false, false, false),
					listen_dev(button_1, "blur", /*blur_handler*/ ctx[39], false, false, false),
					listen_dev(button_1, "touchstart", /*touchstart_handler*/ ctx[40], { passive: true }, false, false),
					listen_dev(button_1, "mousedown", /*mousedown_handler*/ ctx[41], false, false, false),
					listen_dev(button_1, "touchend", /*touchend_handler*/ ctx[42], { passive: true }, false, false),
					listen_dev(button_1, "mouseup", /*mouseup_handler*/ ctx[43], false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (background_slot) {
				if (background_slot.p && (!current || dirty[1] & /*$$scope*/ 8)) {
					update_slot(background_slot, background_slot_template, ctx, /*$$scope*/ ctx[34], dirty, get_background_slot_changes$1, get_background_slot_context$1);
				}
			}

			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx, dirty);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block = if_blocks[current_block_type_index];

				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
				} else {
					if_block.p(ctx, dirty);
				}

				transition_in(if_block, 1);
				if_block.m(span, null);
			}

			if (dirty[0] & /*$ripples, rippleColour*/ 4194308) {
				each_value = /*$ripples*/ ctx[22];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$2(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block$2(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(svg, null);
					}
				}

				group_outros();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}

			if (!current || dirty[0] & /*backgroundColour*/ 1) {
				set_style(button_1, "--colour-background", CSSUtility.parse(/*backgroundColour*/ ctx[0]));
			}

			if (!current || dirty[0] & /*$isAnimatedW, hoverColour, backgroundColour*/ 524291) {
				set_style(button_1, "--colour-hover", CSSUtility.parse(/*$isAnimatedW*/ ctx[19]
				? /*hoverColour*/ ctx[1]
				: /*backgroundColour*/ ctx[0]));
			}

			if (!current || dirty[0] & /*rippleColour*/ 4) {
				set_style(button_1, "--colour-ripple", CSSUtility.parse(/*rippleColour*/ ctx[2]));
			}

			if (!current || dirty[0] & /*$isTextInvertedAgainstBackgroundW, textColour*/ 1048584) {
				set_style(button_1, "--colour-text", CSSUtility.parse(/*$isTextInvertedAgainstBackgroundW*/ ctx[20]
				? "white"
				: /*textColour*/ ctx[3]));
			}

			if (!current || dirty[0] & /*padding*/ 2048) {
				set_style(button_1, "--button-padding", CSSUtility.parse(/*padding*/ ctx[11]));
			}

			if (!current || dirty[0] & /*iconSize*/ 32) {
				set_style(button_1, "--icon-size", CSSUtility.parse(/*iconSize*/ ctx[5]));
			}

			if (!current || dirty[0] & /*textAlign*/ 1024) {
				set_style(button_1, "--text-align", /*textAlign*/ ctx[10]);
			}

			if (!current || dirty[0] & /*$isAnimatedW*/ 524288) {
				set_style(button_1, "--transition", /*$isAnimatedW*/ ctx[19]
				? "0.2s var(--ease-slow-slow)"
				: "unset");
			}

			if (!current || dirty[0] & /*$isTextInvertedAgainstBackgroundW*/ 1048576) {
				set_style(button_1, "--mix-blend-mode", /*$isTextInvertedAgainstBackgroundW*/ ctx[20]
				? "difference"
				: "unset");
			}

			if (!current || dirty[0] & /*$isDisabledW*/ 2097152) {
				prop_dev(button_1, "disabled", /*$isDisabledW*/ ctx[21]);
			}

			if (!current || dirty[0] & /*width*/ 64) {
				set_style(component, "--width", CSSUtility.parse(/*width*/ ctx[6]));
			}

			if (!current || dirty[0] & /*height*/ 256) {
				set_style(component, "--height", CSSUtility.parse(/*height*/ ctx[8]));
			}

			if (!current || dirty[0] & /*roundness*/ 128) {
				set_style(component, "--border-radius", CSSUtility.parse(/*roundness*/ ctx[7]));
			}

			if (dirty[0] & /*$isFocusedW*/ 262144) {
				toggle_class(component, "unpressed", !/*$isFocusedW*/ ctx[18]);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(background_slot, local);
			transition_in(if_block);

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o: function outro(local) {
			transition_out(background_slot, local);
			transition_out(if_block);
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(component);
			if (background_slot) background_slot.d(detaching);
			if_blocks[current_block_type_index].d();
			destroy_each(each_blocks, detaching);
			/*button_1_binding*/ ctx[36](null);
			/*component_binding*/ ctx[44](null);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$i.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

const speed = 1000;
const sizeIn = 20;
const opacityIn = 0.2;

function onMouseUp(event) {
	var _a, _b;

	if (!event.currentTarget) {
		return;
	}

	(_b = (_a = event.currentTarget) === null || _a === void 0
	? void 0
	: _a.parentElement) === null || _b === void 0
	? void 0
	: _b.classList.remove("unpressed");
}

function instance$i($$self, $$props, $$invalidate) {
	let offsetX;
	let offsetY;
	let deltaX;
	let deltaY;
	let scaleRatio;

	let $isFocusedW,
		$$unsubscribe_isFocusedW = noop$1,
		$$subscribe_isFocusedW = () => ($$unsubscribe_isFocusedW(), $$unsubscribe_isFocusedW = subscribe(isFocusedW, $$value => $$invalidate(18, $isFocusedW = $$value)), isFocusedW);

	let $isAnimatedW,
		$$unsubscribe_isAnimatedW = noop$1,
		$$subscribe_isAnimatedW = () => ($$unsubscribe_isAnimatedW(), $$unsubscribe_isAnimatedW = subscribe(isAnimatedW, $$value => $$invalidate(19, $isAnimatedW = $$value)), isAnimatedW);

	let $isTextInvertedAgainstBackgroundW,
		$$unsubscribe_isTextInvertedAgainstBackgroundW = noop$1,
		$$subscribe_isTextInvertedAgainstBackgroundW = () => ($$unsubscribe_isTextInvertedAgainstBackgroundW(), $$unsubscribe_isTextInvertedAgainstBackgroundW = subscribe(isTextInvertedAgainstBackgroundW, $$value => $$invalidate(20, $isTextInvertedAgainstBackgroundW = $$value)), isTextInvertedAgainstBackgroundW);

	let $isDisabledW,
		$$unsubscribe_isDisabledW = noop$1,
		$$subscribe_isDisabledW = () => ($$unsubscribe_isDisabledW(), $$unsubscribe_isDisabledW = subscribe(isDisabledW, $$value => $$invalidate(21, $isDisabledW = $$value)), isDisabledW);

	let $ripples;
	$$self.$$.on_destroy.push(() => $$unsubscribe_isFocusedW());
	$$self.$$.on_destroy.push(() => $$unsubscribe_isAnimatedW());
	$$self.$$.on_destroy.push(() => $$unsubscribe_isTextInvertedAgainstBackgroundW());
	$$self.$$.on_destroy.push(() => $$unsubscribe_isDisabledW());
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("Button", slots, ['background','icon','default']);
	
	let { backgroundColour = "--colour-accent-primary" } = $$props;
	let { hoverColour = "--colour-accent-secondary" } = $$props;
	let { rippleColour = "white" } = $$props;
	let { textColour = "--colour-text-primary" } = $$props;
	let { icon = "done" } = $$props;
	let { iconSize = "1rem" } = $$props;
	let { width = "max-content" } = $$props;
	let { roundness = "--roundness" } = $$props;
	let { height = "max(calc(var(--border-radius) * 2), 56px)" } = $$props;
	let { depth = 1 } = $$props;
	let { isText = true } = $$props;
	let { textAlign = "center" } = $$props;
	let { padding = "16px max(var(--border-radius), 24px)" } = $$props;
	let { isFocusedW = writable(false) } = $$props;
	validate_store(isFocusedW, "isFocusedW");
	$$subscribe_isFocusedW();
	let { isDisabled = false } = $$props;
	let { isDisabledW = writable(isDisabled) } = $$props;
	validate_store(isDisabledW, "isDisabledW");
	$$subscribe_isDisabledW();
	let { isAnimated = true } = $$props;
	let { isAnimatedW = writable(isAnimated) } = $$props;
	validate_store(isAnimatedW, "isAnimatedW");
	$$subscribe_isAnimatedW();
	let { isTextInvertedAgainstBackground = false } = $$props;
	let { isTextInvertedAgainstBackgroundW = writable(isTextInvertedAgainstBackground) } = $$props;
	validate_store(isTextInvertedAgainstBackgroundW, "isTextInvertedAgainstBackgroundW");
	$$subscribe_isTextInvertedAgainstBackgroundW();
	const dispatch = createEventDispatcher();

	const ripples = (() => {
		const arrayW = writable([]);

		return Object.assign(Object.assign({}, arrayW), {
			add: item => arrayW.update(items => [...items, item]),
			clear: () => arrayW.update(() => [])
		});
	})();

	validate_store(ripples, "ripples");
	component_subscribe($$self, ripples, value => $$invalidate(22, $ripples = value));
	let componentDomContent;
	let buttonDomContent;

	const button = {
		get width() {
			return +!!buttonDomContent && buttonDomContent.offsetWidth;
		},
		get height() {
			return +!!buttonDomContent && buttonDomContent.offsetHeight;
		},
		get x() {
			return +!!buttonDomContent && buttonDomContent.getBoundingClientRect().x;
		},
		get y() {
			return +!!buttonDomContent && buttonDomContent.getBoundingClientRect().y;
		}
	};

	onMount(() => {
		Shadow.apply(-depth, buttonDomContent);
		Shadow.apply(depth, componentDomContent);
	});

	const coords = { x: 50, y: 50 };
	let isTouched = false;
	let timeoutHandle;

	function onMouseDown(event, type) {
		var _a, _b;

		switch (type) {
			case "touch":
				{
					isTouched = true;

					ripples.add({
						x: event.touches[0].pageX - button.x,
						y: event.touches[0].pageY - button.y,
						size: scaleRatio
					});

					break;
				}
			case "click":
				{
					if (isTouched) {
						isTouched = false;
						break;
					}

					ripples.add({
						x: event.clientX - button.x,
						y: event.clientY - button.y,
						size: scaleRatio
					});

					break;
				}
			default:
		}

		clearTimeout(timeoutHandle);

		timeoutHandle = setTimeout(
			() => {
				ripples.clear();
			},
			speed + speed * 2
		);

		if (!event.currentTarget) {
			return;
		}

		(_b = (_a = event.currentTarget) === null || _a === void 0
		? void 0
		: _a.parentElement) === null || _b === void 0
		? void 0
		: _b.classList.remove("unpressed");
	}

	const writable_props = [
		"backgroundColour",
		"hoverColour",
		"rippleColour",
		"textColour",
		"icon",
		"iconSize",
		"width",
		"roundness",
		"height",
		"depth",
		"isText",
		"textAlign",
		"padding",
		"isFocusedW",
		"isDisabled",
		"isDisabledW",
		"isAnimated",
		"isAnimatedW",
		"isTextInvertedAgainstBackground",
		"isTextInvertedAgainstBackgroundW"
	];

	Object_1$2.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Button> was created with unknown prop '${key}'`);
	});

	function button_1_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			buttonDomContent = $$value;
			$$invalidate(17, buttonDomContent);
		});
	}

	const click_handler = () => dispatch("click");
	const focus_handler = () => isFocusedW.set(true);
	const blur_handler = () => isFocusedW.set(false);
	const touchstart_handler = event => onMouseDown(event, "touch");
	const mousedown_handler = event => onMouseDown(event, "click");
	const touchend_handler = event => onMouseUp(event);
	const mouseup_handler = event => onMouseUp(event);

	function component_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			componentDomContent = $$value;
			$$invalidate(16, componentDomContent);
		});
	}

	$$self.$$set = $$props => {
		if ("backgroundColour" in $$props) $$invalidate(0, backgroundColour = $$props.backgroundColour);
		if ("hoverColour" in $$props) $$invalidate(1, hoverColour = $$props.hoverColour);
		if ("rippleColour" in $$props) $$invalidate(2, rippleColour = $$props.rippleColour);
		if ("textColour" in $$props) $$invalidate(3, textColour = $$props.textColour);
		if ("icon" in $$props) $$invalidate(4, icon = $$props.icon);
		if ("iconSize" in $$props) $$invalidate(5, iconSize = $$props.iconSize);
		if ("width" in $$props) $$invalidate(6, width = $$props.width);
		if ("roundness" in $$props) $$invalidate(7, roundness = $$props.roundness);
		if ("height" in $$props) $$invalidate(8, height = $$props.height);
		if ("depth" in $$props) $$invalidate(26, depth = $$props.depth);
		if ("isText" in $$props) $$invalidate(9, isText = $$props.isText);
		if ("textAlign" in $$props) $$invalidate(10, textAlign = $$props.textAlign);
		if ("padding" in $$props) $$invalidate(11, padding = $$props.padding);
		if ("isFocusedW" in $$props) $$subscribe_isFocusedW($$invalidate(12, isFocusedW = $$props.isFocusedW));
		if ("isDisabled" in $$props) $$invalidate(27, isDisabled = $$props.isDisabled);
		if ("isDisabledW" in $$props) $$subscribe_isDisabledW($$invalidate(13, isDisabledW = $$props.isDisabledW));
		if ("isAnimated" in $$props) $$invalidate(28, isAnimated = $$props.isAnimated);
		if ("isAnimatedW" in $$props) $$subscribe_isAnimatedW($$invalidate(14, isAnimatedW = $$props.isAnimatedW));
		if ("isTextInvertedAgainstBackground" in $$props) $$invalidate(29, isTextInvertedAgainstBackground = $$props.isTextInvertedAgainstBackground);
		if ("isTextInvertedAgainstBackgroundW" in $$props) $$subscribe_isTextInvertedAgainstBackgroundW($$invalidate(15, isTextInvertedAgainstBackgroundW = $$props.isTextInvertedAgainstBackgroundW));
		if ("$$scope" in $$props) $$invalidate(34, $$scope = $$props.$$scope);
	};

	$$self.$capture_state = () => ({
		onMount,
		createEventDispatcher,
		writable,
		Shadow,
		Ripple,
		CSSUtility,
		backgroundColour,
		hoverColour,
		rippleColour,
		textColour,
		icon,
		iconSize,
		width,
		roundness,
		height,
		depth,
		isText,
		textAlign,
		padding,
		isFocusedW,
		isDisabled,
		isDisabledW,
		isAnimated,
		isAnimatedW,
		isTextInvertedAgainstBackground,
		isTextInvertedAgainstBackgroundW,
		speed,
		sizeIn,
		opacityIn,
		dispatch,
		ripples,
		componentDomContent,
		buttonDomContent,
		button,
		coords,
		isTouched,
		timeoutHandle,
		onMouseDown,
		onMouseUp,
		offsetX,
		offsetY,
		deltaX,
		deltaY,
		scaleRatio,
		$isFocusedW,
		$isAnimatedW,
		$isTextInvertedAgainstBackgroundW,
		$isDisabledW,
		$ripples
	});

	$$self.$inject_state = $$props => {
		if ("backgroundColour" in $$props) $$invalidate(0, backgroundColour = $$props.backgroundColour);
		if ("hoverColour" in $$props) $$invalidate(1, hoverColour = $$props.hoverColour);
		if ("rippleColour" in $$props) $$invalidate(2, rippleColour = $$props.rippleColour);
		if ("textColour" in $$props) $$invalidate(3, textColour = $$props.textColour);
		if ("icon" in $$props) $$invalidate(4, icon = $$props.icon);
		if ("iconSize" in $$props) $$invalidate(5, iconSize = $$props.iconSize);
		if ("width" in $$props) $$invalidate(6, width = $$props.width);
		if ("roundness" in $$props) $$invalidate(7, roundness = $$props.roundness);
		if ("height" in $$props) $$invalidate(8, height = $$props.height);
		if ("depth" in $$props) $$invalidate(26, depth = $$props.depth);
		if ("isText" in $$props) $$invalidate(9, isText = $$props.isText);
		if ("textAlign" in $$props) $$invalidate(10, textAlign = $$props.textAlign);
		if ("padding" in $$props) $$invalidate(11, padding = $$props.padding);
		if ("isFocusedW" in $$props) $$subscribe_isFocusedW($$invalidate(12, isFocusedW = $$props.isFocusedW));
		if ("isDisabled" in $$props) $$invalidate(27, isDisabled = $$props.isDisabled);
		if ("isDisabledW" in $$props) $$subscribe_isDisabledW($$invalidate(13, isDisabledW = $$props.isDisabledW));
		if ("isAnimated" in $$props) $$invalidate(28, isAnimated = $$props.isAnimated);
		if ("isAnimatedW" in $$props) $$subscribe_isAnimatedW($$invalidate(14, isAnimatedW = $$props.isAnimatedW));
		if ("isTextInvertedAgainstBackground" in $$props) $$invalidate(29, isTextInvertedAgainstBackground = $$props.isTextInvertedAgainstBackground);
		if ("isTextInvertedAgainstBackgroundW" in $$props) $$subscribe_isTextInvertedAgainstBackgroundW($$invalidate(15, isTextInvertedAgainstBackgroundW = $$props.isTextInvertedAgainstBackgroundW));
		if ("componentDomContent" in $$props) $$invalidate(16, componentDomContent = $$props.componentDomContent);
		if ("buttonDomContent" in $$props) $$invalidate(17, buttonDomContent = $$props.buttonDomContent);
		if ("isTouched" in $$props) isTouched = $$props.isTouched;
		if ("timeoutHandle" in $$props) timeoutHandle = $$props.timeoutHandle;
		if ("offsetX" in $$props) $$invalidate(30, offsetX = $$props.offsetX);
		if ("offsetY" in $$props) $$invalidate(31, offsetY = $$props.offsetY);
		if ("deltaX" in $$props) $$invalidate(32, deltaX = $$props.deltaX);
		if ("deltaY" in $$props) $$invalidate(33, deltaY = $$props.deltaY);
		if ("scaleRatio" in $$props) scaleRatio = $$props.scaleRatio;
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty[0] & /*offsetX*/ 1073741824) {
			$: $$invalidate(32, deltaX = button.width / 2 + offsetX);
		}

		if ($$self.$$.dirty[1] & /*offsetY*/ 1) {
			$: $$invalidate(33, deltaY = button.height / 2 + offsetY);
		}

		if ($$self.$$.dirty[1] & /*deltaX, deltaY*/ 6) {
			$: scaleRatio = Math.sqrt(Math.pow(deltaX, 3) + Math.pow(deltaY, 3));
		}
	};

	$: $$invalidate(30, offsetX = Math.abs(button.width / 2 - coords.x));
	$: $$invalidate(31, offsetY = Math.abs(button.height / 2 - coords.y));

	return [
		backgroundColour,
		hoverColour,
		rippleColour,
		textColour,
		icon,
		iconSize,
		width,
		roundness,
		height,
		isText,
		textAlign,
		padding,
		isFocusedW,
		isDisabledW,
		isAnimatedW,
		isTextInvertedAgainstBackgroundW,
		componentDomContent,
		buttonDomContent,
		$isFocusedW,
		$isAnimatedW,
		$isTextInvertedAgainstBackgroundW,
		$isDisabledW,
		$ripples,
		dispatch,
		ripples,
		onMouseDown,
		depth,
		isDisabled,
		isAnimated,
		isTextInvertedAgainstBackground,
		offsetX,
		offsetY,
		deltaX,
		deltaY,
		$$scope,
		slots,
		button_1_binding,
		click_handler,
		focus_handler,
		blur_handler,
		touchstart_handler,
		mousedown_handler,
		touchend_handler,
		mouseup_handler,
		component_binding
	];
}

class Button extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(
			this,
			options,
			instance$i,
			create_fragment$i,
			safe_not_equal,
			{
				backgroundColour: 0,
				hoverColour: 1,
				rippleColour: 2,
				textColour: 3,
				icon: 4,
				iconSize: 5,
				width: 6,
				roundness: 7,
				height: 8,
				depth: 26,
				isText: 9,
				textAlign: 10,
				padding: 11,
				isFocusedW: 12,
				isDisabled: 27,
				isDisabledW: 13,
				isAnimated: 28,
				isAnimatedW: 14,
				isTextInvertedAgainstBackground: 29,
				isTextInvertedAgainstBackgroundW: 15
			},
			[-1, -1]
		);

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Button",
			options,
			id: create_fragment$i.name
		});
	}

	get backgroundColour() {
		return this.$$.ctx[0];
	}

	set backgroundColour(backgroundColour) {
		this.$set({ backgroundColour });
		flush();
	}

	get hoverColour() {
		return this.$$.ctx[1];
	}

	set hoverColour(hoverColour) {
		this.$set({ hoverColour });
		flush();
	}

	get rippleColour() {
		return this.$$.ctx[2];
	}

	set rippleColour(rippleColour) {
		this.$set({ rippleColour });
		flush();
	}

	get textColour() {
		return this.$$.ctx[3];
	}

	set textColour(textColour) {
		this.$set({ textColour });
		flush();
	}

	get icon() {
		return this.$$.ctx[4];
	}

	set icon(icon) {
		this.$set({ icon });
		flush();
	}

	get iconSize() {
		return this.$$.ctx[5];
	}

	set iconSize(iconSize) {
		this.$set({ iconSize });
		flush();
	}

	get width() {
		return this.$$.ctx[6];
	}

	set width(width) {
		this.$set({ width });
		flush();
	}

	get roundness() {
		return this.$$.ctx[7];
	}

	set roundness(roundness) {
		this.$set({ roundness });
		flush();
	}

	get height() {
		return this.$$.ctx[8];
	}

	set height(height) {
		this.$set({ height });
		flush();
	}

	get depth() {
		return this.$$.ctx[26];
	}

	set depth(depth) {
		this.$set({ depth });
		flush();
	}

	get isText() {
		return this.$$.ctx[9];
	}

	set isText(isText) {
		this.$set({ isText });
		flush();
	}

	get textAlign() {
		return this.$$.ctx[10];
	}

	set textAlign(textAlign) {
		this.$set({ textAlign });
		flush();
	}

	get padding() {
		return this.$$.ctx[11];
	}

	set padding(padding) {
		this.$set({ padding });
		flush();
	}

	get isFocusedW() {
		return this.$$.ctx[12];
	}

	set isFocusedW(isFocusedW) {
		this.$set({ isFocusedW });
		flush();
	}

	get isDisabled() {
		return this.$$.ctx[27];
	}

	set isDisabled(isDisabled) {
		this.$set({ isDisabled });
		flush();
	}

	get isDisabledW() {
		return this.$$.ctx[13];
	}

	set isDisabledW(isDisabledW) {
		this.$set({ isDisabledW });
		flush();
	}

	get isAnimated() {
		return this.$$.ctx[28];
	}

	set isAnimated(isAnimated) {
		this.$set({ isAnimated });
		flush();
	}

	get isAnimatedW() {
		return this.$$.ctx[14];
	}

	set isAnimatedW(isAnimatedW) {
		this.$set({ isAnimatedW });
		flush();
	}

	get isTextInvertedAgainstBackground() {
		return this.$$.ctx[29];
	}

	set isTextInvertedAgainstBackground(isTextInvertedAgainstBackground) {
		this.$set({ isTextInvertedAgainstBackground });
		flush();
	}

	get isTextInvertedAgainstBackgroundW() {
		return this.$$.ctx[15];
	}

	set isTextInvertedAgainstBackgroundW(isTextInvertedAgainstBackgroundW) {
		this.$set({ isTextInvertedAgainstBackgroundW });
		flush();
	}
}

var undefined$h = undefined;

/* src\ui\blocks\Hint.svelte generated by Svelte v3.38.2 */
const file$h = "src\\ui\\blocks\\Hint.svelte";

// (45:2) {#if LevelIcons[$levelW] != null}
function create_if_block$5(ctx) {
	let icon;
	let t_value = LevelIcons[/*$levelW*/ ctx[2]] + "";
	let t;

	const block = {
		c: function create() {
			icon = element("icon");
			t = text(t_value);
			attr_dev(icon, "class", "svelte-s82p4j");
			add_location(icon, file$h, 45, 3, 1715);
		},
		m: function mount(target, anchor) {
			insert_dev(target, icon, anchor);
			append_dev(icon, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*$levelW*/ 4 && t_value !== (t_value = LevelIcons[/*$levelW*/ ctx[2]] + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(icon);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$5.name,
		type: "if",
		source: "(45:2) {#if LevelIcons[$levelW] != null}",
		ctx
	});

	return block;
}

// (51:9) Hint
function fallback_block$3(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("Hint");
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: fallback_block$3.name,
		type: "fallback",
		source: "(51:9) Hint",
		ctx
	});

	return block;
}

function create_fragment$h(ctx) {
	let component;
	let span;
	let t;
	let string;
	let current;
	let if_block = LevelIcons[/*$levelW*/ ctx[2]] != null && create_if_block$5(ctx);
	const default_slot_template = /*#slots*/ ctx[5].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);
	const default_slot_or_fallback = default_slot || fallback_block$3(ctx);

	const block = {
		c: function create() {
			component = element("component");
			span = element("span");
			if (if_block) if_block.c();
			t = space();
			string = element("string");
			if (default_slot_or_fallback) default_slot_or_fallback.c();
			attr_dev(string, "class", "text svelte-s82p4j");
			add_location(string, file$h, 49, 2, 1773);
			attr_dev(span, "class", "content svelte-s82p4j");
			set_style(span, "--colour-hint", CSSUtility.parse(/*overrideColour*/ ctx[1] ?? LevelColours[/*$levelW*/ ctx[2]] ?? "") + "\r\n\t\t");
			toggle_class(span, "info", /*$levelW*/ ctx[2] === Levels.INFO);
			toggle_class(span, "warn", /*$levelW*/ ctx[2] === Levels.WARN);
			toggle_class(span, "error", /*$levelW*/ ctx[2] === Levels.ERROR);
			toggle_class(span, "ok", /*$levelW*/ ctx[2] === Levels.OK);
			toggle_class(span, "none", /*$levelW*/ ctx[2] === Levels.NONE);
			add_location(span, file$h, 33, 1, 1346);
			add_location(component, file$h, 32, 0, 1332);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, component, anchor);
			append_dev(component, span);
			if (if_block) if_block.m(span, null);
			append_dev(span, t);
			append_dev(span, string);

			if (default_slot_or_fallback) {
				default_slot_or_fallback.m(string, null);
			}

			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (LevelIcons[/*$levelW*/ ctx[2]] != null) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$5(ctx);
					if_block.c();
					if_block.m(span, t);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[4], dirty, null, null);
				}
			}

			if (!current || dirty & /*overrideColour, $levelW*/ 6) {
				set_style(span, "--colour-hint", CSSUtility.parse(/*overrideColour*/ ctx[1] ?? LevelColours[/*$levelW*/ ctx[2]] ?? "") + "\r\n\t\t");
			}

			if (dirty & /*$levelW, Levels*/ 4) {
				toggle_class(span, "info", /*$levelW*/ ctx[2] === Levels.INFO);
			}

			if (dirty & /*$levelW, Levels*/ 4) {
				toggle_class(span, "warn", /*$levelW*/ ctx[2] === Levels.WARN);
			}

			if (dirty & /*$levelW, Levels*/ 4) {
				toggle_class(span, "error", /*$levelW*/ ctx[2] === Levels.ERROR);
			}

			if (dirty & /*$levelW, Levels*/ 4) {
				toggle_class(span, "ok", /*$levelW*/ ctx[2] === Levels.OK);
			}

			if (dirty & /*$levelW, Levels*/ 4) {
				toggle_class(span, "none", /*$levelW*/ ctx[2] === Levels.NONE);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot_or_fallback, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot_or_fallback, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(component);
			if (if_block) if_block.d();
			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$h.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

var Levels;

(function (Levels) {
	Levels[Levels["INFO"] = 0] = "INFO";
	Levels[Levels["WARN"] = 1] = "WARN";
	Levels[Levels["ERROR"] = 2] = "ERROR";
	Levels[Levels["OK"] = 3] = "OK";
	Levels[Levels["NONE"] = 4] = "NONE";
})(Levels || (Levels = {}));

var LevelIcons;

(function (LevelIcons) {
	LevelIcons[LevelIcons["error_outline"] = 0] = "error_outline";
	LevelIcons[LevelIcons["warning"] = 1] = "warning";
	LevelIcons[LevelIcons["error"] = 2] = "error";
	LevelIcons[LevelIcons["done"] = 3] = "done";
})(LevelIcons || (LevelIcons = {}));

var LevelColours;

(function (LevelColours) {
	LevelColours[LevelColours["--colour-text-primary"] = 0] = "--colour-text-primary";
	LevelColours[LevelColours["--colour-warn-primary"] = 1] = "--colour-warn-primary";
	LevelColours[LevelColours["--colour-error-primary"] = 2] = "--colour-error-primary";
	LevelColours[LevelColours["--colour-ok-primary"] = 3] = "--colour-ok-primary";
})(LevelColours || (LevelColours = {}));

function instance$h($$self, $$props, $$invalidate) {
	let $levelW,
		$$unsubscribe_levelW = noop$1,
		$$subscribe_levelW = () => ($$unsubscribe_levelW(), $$unsubscribe_levelW = subscribe(levelW, $$value => $$invalidate(2, $levelW = $$value)), levelW);

	$$self.$$.on_destroy.push(() => $$unsubscribe_levelW());
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("Hint", slots, ['default']);
	
	let { level = Levels.INFO } = $$props;
	let { levelW = writable(level) } = $$props;
	validate_store(levelW, "levelW");
	$$subscribe_levelW();
	let { overrideColour = undefined } = $$props;
	const writable_props = ["level", "levelW", "overrideColour"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Hint> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ("level" in $$props) $$invalidate(3, level = $$props.level);
		if ("levelW" in $$props) $$subscribe_levelW($$invalidate(0, levelW = $$props.levelW));
		if ("overrideColour" in $$props) $$invalidate(1, overrideColour = $$props.overrideColour);
		if ("$$scope" in $$props) $$invalidate(4, $$scope = $$props.$$scope);
	};

	$$self.$capture_state = () => ({
		Levels,
		LevelIcons,
		LevelColours,
		writable,
		CSSUtility,
		level,
		levelW,
		overrideColour,
		$levelW
	});

	$$self.$inject_state = $$props => {
		if ("level" in $$props) $$invalidate(3, level = $$props.level);
		if ("levelW" in $$props) $$subscribe_levelW($$invalidate(0, levelW = $$props.levelW));
		if ("overrideColour" in $$props) $$invalidate(1, overrideColour = $$props.overrideColour);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [levelW, overrideColour, $levelW, level, $$scope, slots];
}

class Hint extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$h, create_fragment$h, safe_not_equal, { level: 3, levelW: 0, overrideColour: 1 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Hint",
			options,
			id: create_fragment$h.name
		});
	}

	get level() {
		return this.$$.ctx[3];
	}

	set level(level) {
		this.$set({ level });
		flush();
	}

	get levelW() {
		return this.$$.ctx[0];
	}

	set levelW(levelW) {
		this.$set({ levelW });
		flush();
	}

	get overrideColour() {
		return this.$$.ctx[1];
	}

	set overrideColour(overrideColour) {
		this.$set({ overrideColour });
		flush();
	}
}

var undefined$g = undefined;

/* src\ui\blocks\Input.svelte generated by Svelte v3.38.2 */
const file$g = "src\\ui\\blocks\\Input.svelte";
const get_button_slot_changes = dirty => ({});
const get_button_slot_context = ctx => ({ submit: /*submit*/ ctx[4] });

// (139:3) {:else}
function create_else_block$1(ctx) {
	let button_1;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			button_1 = element("button");
			set_style(button_1, "display", "none");
			add_location(button_1, file$g, 139, 4, 4263);
		},
		m: function mount(target, anchor) {
			insert_dev(target, button_1, anchor);
			/*button_1_binding*/ ctx[46](button_1);

			if (!mounted) {
				dispose = listen_dev(button_1, "click", /*submit*/ ctx[4], false, false, false);
				mounted = true;
			}
		},
		p: noop$1,
		i: noop$1,
		o: noop$1,
		d: function destroy(detaching) {
			if (detaching) detach_dev(button_1);
			/*button_1_binding*/ ctx[46](null);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block$1.name,
		type: "else",
		source: "(139:3) {:else}",
		ctx
	});

	return block;
}

// (126:3) {#if buttonComponent}
function create_if_block_1$2(ctx) {
	let container;
	let switch_instance;
	let current;
	const switch_instance_spread_levels = [{ height: "100%" }, { width: "100%" }, /*buttonProps*/ ctx[9]];
	var switch_value = /*buttonComponent*/ ctx[8];

	function switch_props(ctx) {
		let switch_instance_props = {};

		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
		}

		return {
			props: switch_instance_props,
			$$inline: true
		};
	}

	if (switch_value) {
		switch_instance = new switch_value(switch_props(ctx));
		/*switch_instance_binding*/ ctx[45](switch_instance);
		switch_instance.$on("click", /*submit*/ ctx[4]);
	}

	const block = {
		c: function create() {
			container = element("container");
			if (switch_instance) create_component(switch_instance.$$.fragment);
			attr_dev(container, "class", "button svelte-1qky064");
			add_location(container, file$g, 126, 4, 3992);
		},
		m: function mount(target, anchor) {
			insert_dev(target, container, anchor);

			if (switch_instance) {
				mount_component(switch_instance, container, null);
			}

			current = true;
		},
		p: function update(ctx, dirty) {
			const switch_instance_changes = (dirty[0] & /*buttonProps*/ 512)
			? get_spread_update(switch_instance_spread_levels, [
					switch_instance_spread_levels[0],
					switch_instance_spread_levels[1],
					get_spread_object(/*buttonProps*/ ctx[9])
				])
			: {};

			if (switch_value !== (switch_value = /*buttonComponent*/ ctx[8])) {
				if (switch_instance) {
					group_outros();
					const old_component = switch_instance;

					transition_out(old_component.$$.fragment, 1, 0, () => {
						destroy_component(old_component, 1);
					});

					check_outros();
				}

				if (switch_value) {
					switch_instance = new switch_value(switch_props(ctx));
					/*switch_instance_binding*/ ctx[45](switch_instance);
					switch_instance.$on("click", /*submit*/ ctx[4]);
					create_component(switch_instance.$$.fragment);
					transition_in(switch_instance.$$.fragment, 1);
					mount_component(switch_instance, container, null);
				} else {
					switch_instance = null;
				}
			} else if (switch_value) {
				switch_instance.$set(switch_instance_changes);
			}
		},
		i: function intro(local) {
			if (current) return;
			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(container);
			/*switch_instance_binding*/ ctx[45](null);
			if (switch_instance) destroy_component(switch_instance);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$2.name,
		type: "if",
		source: "(126:3) {#if buttonComponent}",
		ctx
	});

	return block;
}

// (125:3)      
function fallback_block$2(ctx) {
	let current_block_type_index;
	let if_block;
	let if_block_anchor;
	let current;
	const if_block_creators = [create_if_block_1$2, create_else_block$1];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*buttonComponent*/ ctx[8]) return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx, [-1]);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	const block = {
		c: function create() {
			if_block.c();
			if_block_anchor = empty();
		},
		m: function mount(target, anchor) {
			if_blocks[current_block_type_index].m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx, dirty);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block = if_blocks[current_block_type_index];

				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
				} else {
					if_block.p(ctx, dirty);
				}

				transition_in(if_block, 1);
				if_block.m(if_block_anchor.parentNode, if_block_anchor);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if_blocks[current_block_type_index].d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: fallback_block$2.name,
		type: "fallback",
		source: "(125:3)      ",
		ctx
	});

	return block;
}

// (148:1) {#if $hintW !== null}
function create_if_block$4(ctx) {
	let hint;
	let current;

	hint = new Hint({
			props: {
				levelW: /*hintLevelW*/ ctx[10],
				$$slots: { default: [create_default_slot$7] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(hint.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(hint, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const hint_changes = {};
			if (dirty[0] & /*hintLevelW*/ 1024) hint_changes.levelW = /*hintLevelW*/ ctx[10];

			if (dirty[1] & /*$$scope, $hintW*/ 131080) {
				hint_changes.$$scope = { dirty, ctx };
			}

			hint.$set(hint_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(hint.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(hint.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(hint, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$4.name,
		type: "if",
		source: "(148:1) {#if $hintW !== null}",
		ctx
	});

	return block;
}

// (149:2) <Hint levelW={hintLevelW}>
function create_default_slot$7(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text(/*$hintW*/ ctx[34]);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty[1] & /*$hintW*/ 8) set_data_dev(t, /*$hintW*/ ctx[34]);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot$7.name,
		type: "slot",
		source: "(149:2) <Hint levelW={hintLevelW}>",
		ctx
	});

	return block;
}

function create_fragment$g(ctx) {
	let component;
	let form;
	let input;
	let input_form_value;
	let input_placeholder_value;
	let input_style_value;
	let t0;
	let label_1;
	let string;
	let t1;
	let t2;
	let form_id_value;
	let t3;
	let current;
	let mounted;
	let dispose;

	let input_levels = [
		{ type: "text" },
		{
			form: input_form_value = /*formId*/ ctx[29] || /*randomFormId*/ ctx[35]
		},
		{ id: /*randomInputId*/ ctx[36] },
		{ class: "text" },
		{
			placeholder: input_placeholder_value = /*placeholder*/ ctx[26] || /*label*/ ctx[7]
		},
		{
			style: input_style_value = "\r\n\t\t\t\t--colour-text: " + CSSUtility.parse(/*textColour*/ ctx[23]) + ";\r\n\t\t\t"
		},
		/*$$restProps*/ ctx[37]
	];

	let input_data = {};

	for (let i = 0; i < input_levels.length; i += 1) {
		input_data = assign(input_data, input_levels[i]);
	}

	const button_slot_template = /*#slots*/ ctx[42].button;
	const button_slot = create_slot(button_slot_template, ctx, /*$$scope*/ ctx[48], get_button_slot_context);
	const button_slot_or_fallback = button_slot || fallback_block$2(ctx);
	let if_block = /*$hintW*/ ctx[34] !== null && create_if_block$4(ctx);

	const block = {
		c: function create() {
			component = element("component");
			form = element("form");
			input = element("input");
			t0 = space();
			label_1 = element("label");
			string = element("string");
			t1 = text(/*label*/ ctx[7]);
			t2 = space();
			if (button_slot_or_fallback) button_slot_or_fallback.c();
			t3 = space();
			if (if_block) if_block.c();
			set_attributes(input, input_data);
			toggle_class(input, "svelte-1qky064", true);
			add_location(input, file$g, 89, 2, 2879);
			attr_dev(string, "class", "svelte-1qky064");
			add_location(string, file$g, 117, 3, 3867);
			attr_dev(label_1, "for", /*randomInputId*/ ctx[36]);
			set_style(label_1, "--colour-label", CSSUtility.parse(/*labelColour*/ ctx[24]));
			set_style(label_1, "--floating-label-indent", CSSUtility.parse(/*floatingLabelIndent*/ ctx[25]));
			set_style(label_1, "--label-font-size", CSSUtility.parse(/*labelFontSize*/ ctx[17]));

			set_style(label_1, "--label-focused-top", /*isMovingLabel*/ ctx[28]
			? "calc(0px - var(--label-top))"
			: "calc((var(--height) - var(--font-size)) / 2)");

			set_style(label_1, "--label-focused-opacity", /*isMovingLabel*/ ctx[28] ? 1 : 0.2);
			set_style(label_1, "--label-focused-opacity-no-placeholder", /*isMovingLabel*/ ctx[28] ? 1 : 0);

			set_style(label_1, "--label-focused-indent", /*isMovingLabel*/ ctx[28]
			? "var(--floating-label-indent)"
			: "var(--indent)");

			set_style(label_1, "--label-transition-duration", /*isMovingLabel*/ ctx[28] ? "0.2s" : "0.1s");
			attr_dev(label_1, "class", "svelte-1qky064");
			add_location(label_1, file$g, 104, 2, 3205);

			attr_dev(form, "id", form_id_value = /*formId*/ ctx[29]
			? undefined
			: /*randomFormId*/ ctx[35]);

			set_style(form, "--active-colour-background", CSSUtility.parse(/*activeBackgroundColour*/ ctx[22]));
			set_style(form, "--colour-background", CSSUtility.parse(/*backgroundColour*/ ctx[21]));
			set_style(form, "--form-valued-margin-top", /*isMovingLabel*/ ctx[28] ? "var(--label-top)" : "0");
			attr_dev(form, "class", "svelte-1qky064");
			toggle_class(form, "inactive", !/*$isActiveW*/ ctx[33]);
			toggle_class(form, "valued", !!/*$valueW*/ ctx[30]);
			add_location(form, file$g, 77, 1, 2463);
			set_style(component, "--border-radius", CSSUtility.parse(/*roundness*/ ctx[12]));
			set_style(component, "--width", CSSUtility.parse(/*width*/ ctx[14]));
			set_style(component, "--height", CSSUtility.parse(/*height*/ ctx[13]));
			set_style(component, "--font-size", CSSUtility.parse(/*fontSize*/ ctx[16]));
			set_style(component, "--label-top", CSSUtility.parse(/*labelTop*/ ctx[18]));
			set_style(component, "--min-indent", CSSUtility.parse(/*minIndent*/ ctx[19]));
			set_style(component, "--indent", CSSUtility.parse(/*indent*/ ctx[20]));
			set_style(component, "--button-width", CSSUtility.parse(/*buttonWidth*/ ctx[15]));
			set_style(component, "--font-family", CSSUtility.parse(/*fontFamily*/ ctx[27]));
			attr_dev(component, "class", "svelte-1qky064");
			add_location(component, file$g, 64, 0, 2019);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, component, anchor);
			append_dev(component, form);
			append_dev(form, input);
			set_input_value(input, /*value*/ ctx[0]);
			/*input_binding*/ ctx[44](input);
			append_dev(form, t0);
			append_dev(form, label_1);
			append_dev(label_1, string);
			append_dev(string, t1);
			append_dev(form, t2);

			if (button_slot_or_fallback) {
				button_slot_or_fallback.m(form, null);
			}

			/*form_binding*/ ctx[47](form);
			append_dev(component, t3);
			if (if_block) if_block.m(component, null);
			current = true;

			if (!mounted) {
				dispose = [
					listen_dev(input, "input", /*input_input_handler*/ ctx[43]),
					listen_dev(
						input,
						"focus",
						function () {
							if (is_function(/*onFocus*/ ctx[5])) /*onFocus*/ ctx[5].apply(this, arguments);
						},
						false,
						false,
						false
					),
					listen_dev(
						input,
						"blur",
						function () {
							if (is_function(/*onBlur*/ ctx[6])) /*onBlur*/ ctx[6].apply(this, arguments);
						},
						false,
						false,
						false
					),
					listen_dev(form, "submit", prevent_default(submit_handler), false, true, false)
				];

				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;

			set_attributes(input, input_data = get_spread_update(input_levels, [
				{ type: "text" },
				(!current || dirty[0] & /*formId*/ 536870912 && input_form_value !== (input_form_value = /*formId*/ ctx[29] || /*randomFormId*/ ctx[35])) && { form: input_form_value },
				{ id: /*randomInputId*/ ctx[36] },
				{ class: "text" },
				(!current || dirty[0] & /*placeholder, label*/ 67108992 && input_placeholder_value !== (input_placeholder_value = /*placeholder*/ ctx[26] || /*label*/ ctx[7])) && { placeholder: input_placeholder_value },
				(!current || dirty[0] & /*textColour*/ 8388608 && input_style_value !== (input_style_value = "\r\n\t\t\t\t--colour-text: " + CSSUtility.parse(/*textColour*/ ctx[23]) + ";\r\n\t\t\t")) && { style: input_style_value },
				dirty[1] & /*$$restProps*/ 64 && /*$$restProps*/ ctx[37]
			]));

			if (dirty[0] & /*value*/ 1 && input.value !== /*value*/ ctx[0]) {
				set_input_value(input, /*value*/ ctx[0]);
			}

			toggle_class(input, "svelte-1qky064", true);
			if (!current || dirty[0] & /*label*/ 128) set_data_dev(t1, /*label*/ ctx[7]);

			if (!current || dirty[0] & /*labelColour*/ 16777216) {
				set_style(label_1, "--colour-label", CSSUtility.parse(/*labelColour*/ ctx[24]));
			}

			if (!current || dirty[0] & /*floatingLabelIndent*/ 33554432) {
				set_style(label_1, "--floating-label-indent", CSSUtility.parse(/*floatingLabelIndent*/ ctx[25]));
			}

			if (!current || dirty[0] & /*labelFontSize*/ 131072) {
				set_style(label_1, "--label-font-size", CSSUtility.parse(/*labelFontSize*/ ctx[17]));
			}

			if (!current || dirty[0] & /*isMovingLabel*/ 268435456) {
				set_style(label_1, "--label-focused-top", /*isMovingLabel*/ ctx[28]
				? "calc(0px - var(--label-top))"
				: "calc((var(--height) - var(--font-size)) / 2)");
			}

			if (!current || dirty[0] & /*isMovingLabel*/ 268435456) {
				set_style(label_1, "--label-focused-opacity", /*isMovingLabel*/ ctx[28] ? 1 : 0.2);
			}

			if (!current || dirty[0] & /*isMovingLabel*/ 268435456) {
				set_style(label_1, "--label-focused-opacity-no-placeholder", /*isMovingLabel*/ ctx[28] ? 1 : 0);
			}

			if (!current || dirty[0] & /*isMovingLabel*/ 268435456) {
				set_style(label_1, "--label-focused-indent", /*isMovingLabel*/ ctx[28]
				? "var(--floating-label-indent)"
				: "var(--indent)");
			}

			if (!current || dirty[0] & /*isMovingLabel*/ 268435456) {
				set_style(label_1, "--label-transition-duration", /*isMovingLabel*/ ctx[28] ? "0.2s" : "0.1s");
			}

			if (button_slot) {
				if (button_slot.p && (!current || dirty[1] & /*$$scope*/ 131072)) {
					update_slot(button_slot, button_slot_template, ctx, /*$$scope*/ ctx[48], dirty, get_button_slot_changes, get_button_slot_context);
				}
			} else {
				if (button_slot_or_fallback && button_slot_or_fallback.p && dirty[0] & /*buttonComponent, buttonProps, button*/ 770) {
					button_slot_or_fallback.p(ctx, dirty);
				}
			}

			if (!current || dirty[0] & /*formId*/ 536870912 && form_id_value !== (form_id_value = /*formId*/ ctx[29]
			? undefined
			: /*randomFormId*/ ctx[35])) {
				attr_dev(form, "id", form_id_value);
			}

			if (!current || dirty[0] & /*activeBackgroundColour*/ 4194304) {
				set_style(form, "--active-colour-background", CSSUtility.parse(/*activeBackgroundColour*/ ctx[22]));
			}

			if (!current || dirty[0] & /*backgroundColour*/ 2097152) {
				set_style(form, "--colour-background", CSSUtility.parse(/*backgroundColour*/ ctx[21]));
			}

			if (!current || dirty[0] & /*isMovingLabel*/ 268435456) {
				set_style(form, "--form-valued-margin-top", /*isMovingLabel*/ ctx[28] ? "var(--label-top)" : "0");
			}

			if (dirty[1] & /*$isActiveW*/ 4) {
				toggle_class(form, "inactive", !/*$isActiveW*/ ctx[33]);
			}

			if (dirty[0] & /*$valueW*/ 1073741824) {
				toggle_class(form, "valued", !!/*$valueW*/ ctx[30]);
			}

			if (/*$hintW*/ ctx[34] !== null) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty[1] & /*$hintW*/ 8) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block$4(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(component, null);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}

			if (!current || dirty[0] & /*roundness*/ 4096) {
				set_style(component, "--border-radius", CSSUtility.parse(/*roundness*/ ctx[12]));
			}

			if (!current || dirty[0] & /*width*/ 16384) {
				set_style(component, "--width", CSSUtility.parse(/*width*/ ctx[14]));
			}

			if (!current || dirty[0] & /*height*/ 8192) {
				set_style(component, "--height", CSSUtility.parse(/*height*/ ctx[13]));
			}

			if (!current || dirty[0] & /*fontSize*/ 65536) {
				set_style(component, "--font-size", CSSUtility.parse(/*fontSize*/ ctx[16]));
			}

			if (!current || dirty[0] & /*labelTop*/ 262144) {
				set_style(component, "--label-top", CSSUtility.parse(/*labelTop*/ ctx[18]));
			}

			if (!current || dirty[0] & /*minIndent*/ 524288) {
				set_style(component, "--min-indent", CSSUtility.parse(/*minIndent*/ ctx[19]));
			}

			if (!current || dirty[0] & /*indent*/ 1048576) {
				set_style(component, "--indent", CSSUtility.parse(/*indent*/ ctx[20]));
			}

			if (!current || dirty[0] & /*buttonWidth*/ 32768) {
				set_style(component, "--button-width", CSSUtility.parse(/*buttonWidth*/ ctx[15]));
			}

			if (!current || dirty[0] & /*fontFamily*/ 134217728) {
				set_style(component, "--font-family", CSSUtility.parse(/*fontFamily*/ ctx[27]));
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(button_slot_or_fallback, local);
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(button_slot_or_fallback, local);
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(component);
			/*input_binding*/ ctx[44](null);
			if (button_slot_or_fallback) button_slot_or_fallback.d(detaching);
			/*form_binding*/ ctx[47](null);
			if (if_block) if_block.d();
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$g.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

const submit_handler = () => false;

function instance$g($$self, $$props, $$invalidate) {
	const omit_props_names = [
		"value","valueW","isActive","isActiveW","focus","submit","blur","onFocus","onBlur","label","buttonComponent","buttonProps","hintLevelW","hintW","depth","roundness","height","width","buttonWidth","fontSize","labelFontSize","labelTop","minIndent","indent","backgroundColour","activeBackgroundColour","textColour","labelColour","floatingLabelIndent","placeholder","fontFamily","isMovingLabel","button","formId"
	];

	let $$restProps = compute_rest_props($$props, omit_props_names);

	let $valueW,
		$$unsubscribe_valueW = noop$1,
		$$subscribe_valueW = () => ($$unsubscribe_valueW(), $$unsubscribe_valueW = subscribe(valueW, $$value => $$invalidate(30, $valueW = $$value)), valueW);

	let $isActiveW,
		$$unsubscribe_isActiveW = noop$1,
		$$subscribe_isActiveW = () => ($$unsubscribe_isActiveW(), $$unsubscribe_isActiveW = subscribe(isActiveW, $$value => $$invalidate(33, $isActiveW = $$value)), isActiveW);

	let $hintW,
		$$unsubscribe_hintW = noop$1,
		$$subscribe_hintW = () => ($$unsubscribe_hintW(), $$unsubscribe_hintW = subscribe(hintW, $$value => $$invalidate(34, $hintW = $$value)), hintW);

	$$self.$$.on_destroy.push(() => $$unsubscribe_valueW());
	$$self.$$.on_destroy.push(() => $$unsubscribe_isActiveW());
	$$self.$$.on_destroy.push(() => $$unsubscribe_hintW());
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("Input", slots, ['button']);
	
	let { value = "" } = $$props;
	let { valueW = writable(value) } = $$props;
	validate_store(valueW, "valueW");
	$$subscribe_valueW();
	let { isActive = false } = $$props;
	let { isActiveW = writable(isActive) } = $$props;
	validate_store(isActiveW, "isActiveW");
	$$subscribe_isActiveW();

	function focus() {
		inputDomContent.focus();
	}

	function submit() {
		dispatch("submit", $valueW);
	}

	function blur() {
		inputDomContent.blur();
	}

	let { onFocus = () => {
		set_store_value(isActiveW, $isActiveW = true, $isActiveW);
	} } = $$props;

	let { onBlur = () => {
		set_store_value(isActiveW, $isActiveW = false, $isActiveW);
	} } = $$props;

	let { label = "Input" } = $$props;
	let { buttonComponent = Button } = $$props;
	let { buttonProps = {} } = $$props;
	let { hintLevelW = writable(0) } = $$props;
	let { hintW = writable(null) } = $$props;
	validate_store(hintW, "hintW");
	$$subscribe_hintW();
	let { depth = 3 } = $$props;
	let { roundness = "var(--roundness)" } = $$props;
	let { height = 56 } = $$props;
	let { width = "100%" } = $$props;
	let { buttonWidth = height } = $$props;
	let { fontSize = "1rem" } = $$props;
	let { labelFontSize = "1rem" } = $$props;
	let { labelTop = 28 } = $$props;
	let { minIndent = 16 } = $$props;
	let { indent = "max(var(--min-indent), var(--roundness))" } = $$props;
	let { backgroundColour = "--colour-background-secondary" } = $$props;
	let { activeBackgroundColour = "--colour-background-primary" } = $$props;
	let { textColour = "--colour-text-primary" } = $$props;
	let { labelColour = "--colour-text-secondary" } = $$props;
	let { floatingLabelIndent = "0" } = $$props;
	let { placeholder = "" } = $$props;
	let { fontFamily = "--font-family-2" } = $$props;
	let { isMovingLabel = true } = $$props;
	let { button = undefined } = $$props;
	let { formId = undefined } = $$props;
	const dispatch = createEventDispatcher();
	const randomFormId = RandomUtility.string();
	const randomInputId = RandomUtility.string();
	let formDomContent;
	let inputDomContent;

	onMount(() => {
		Shadow.apply(depth, formDomContent);
	});

	function input_input_handler() {
		value = this.value;
		($$invalidate(0, value), $$invalidate(30, $valueW));
	}

	function input_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			inputDomContent = $$value;
			$$invalidate(32, inputDomContent);
		});
	}

	function switch_instance_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			button = $$value;
			$$invalidate(1, button);
		});
	}

	function button_1_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			button = $$value;
			$$invalidate(1, button);
		});
	}

	function form_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			formDomContent = $$value;
			$$invalidate(31, formDomContent);
		});
	}

	$$self.$$set = $$new_props => {
		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
		$$invalidate(37, $$restProps = compute_rest_props($$props, omit_props_names));
		if ("value" in $$new_props) $$invalidate(0, value = $$new_props.value);
		if ("valueW" in $$new_props) $$subscribe_valueW($$invalidate(2, valueW = $$new_props.valueW));
		if ("isActive" in $$new_props) $$invalidate(38, isActive = $$new_props.isActive);
		if ("isActiveW" in $$new_props) $$subscribe_isActiveW($$invalidate(3, isActiveW = $$new_props.isActiveW));
		if ("onFocus" in $$new_props) $$invalidate(5, onFocus = $$new_props.onFocus);
		if ("onBlur" in $$new_props) $$invalidate(6, onBlur = $$new_props.onBlur);
		if ("label" in $$new_props) $$invalidate(7, label = $$new_props.label);
		if ("buttonComponent" in $$new_props) $$invalidate(8, buttonComponent = $$new_props.buttonComponent);
		if ("buttonProps" in $$new_props) $$invalidate(9, buttonProps = $$new_props.buttonProps);
		if ("hintLevelW" in $$new_props) $$invalidate(10, hintLevelW = $$new_props.hintLevelW);
		if ("hintW" in $$new_props) $$subscribe_hintW($$invalidate(11, hintW = $$new_props.hintW));
		if ("depth" in $$new_props) $$invalidate(41, depth = $$new_props.depth);
		if ("roundness" in $$new_props) $$invalidate(12, roundness = $$new_props.roundness);
		if ("height" in $$new_props) $$invalidate(13, height = $$new_props.height);
		if ("width" in $$new_props) $$invalidate(14, width = $$new_props.width);
		if ("buttonWidth" in $$new_props) $$invalidate(15, buttonWidth = $$new_props.buttonWidth);
		if ("fontSize" in $$new_props) $$invalidate(16, fontSize = $$new_props.fontSize);
		if ("labelFontSize" in $$new_props) $$invalidate(17, labelFontSize = $$new_props.labelFontSize);
		if ("labelTop" in $$new_props) $$invalidate(18, labelTop = $$new_props.labelTop);
		if ("minIndent" in $$new_props) $$invalidate(19, minIndent = $$new_props.minIndent);
		if ("indent" in $$new_props) $$invalidate(20, indent = $$new_props.indent);
		if ("backgroundColour" in $$new_props) $$invalidate(21, backgroundColour = $$new_props.backgroundColour);
		if ("activeBackgroundColour" in $$new_props) $$invalidate(22, activeBackgroundColour = $$new_props.activeBackgroundColour);
		if ("textColour" in $$new_props) $$invalidate(23, textColour = $$new_props.textColour);
		if ("labelColour" in $$new_props) $$invalidate(24, labelColour = $$new_props.labelColour);
		if ("floatingLabelIndent" in $$new_props) $$invalidate(25, floatingLabelIndent = $$new_props.floatingLabelIndent);
		if ("placeholder" in $$new_props) $$invalidate(26, placeholder = $$new_props.placeholder);
		if ("fontFamily" in $$new_props) $$invalidate(27, fontFamily = $$new_props.fontFamily);
		if ("isMovingLabel" in $$new_props) $$invalidate(28, isMovingLabel = $$new_props.isMovingLabel);
		if ("button" in $$new_props) $$invalidate(1, button = $$new_props.button);
		if ("formId" in $$new_props) $$invalidate(29, formId = $$new_props.formId);
		if ("$$scope" in $$new_props) $$invalidate(48, $$scope = $$new_props.$$scope);
	};

	$$self.$capture_state = () => ({
		onMount,
		createEventDispatcher,
		writable,
		RandomUtility,
		CSSUtility,
		Button,
		Hint,
		Shadow,
		value,
		valueW,
		isActive,
		isActiveW,
		focus,
		submit,
		blur,
		onFocus,
		onBlur,
		label,
		buttonComponent,
		buttonProps,
		hintLevelW,
		hintW,
		depth,
		roundness,
		height,
		width,
		buttonWidth,
		fontSize,
		labelFontSize,
		labelTop,
		minIndent,
		indent,
		backgroundColour,
		activeBackgroundColour,
		textColour,
		labelColour,
		floatingLabelIndent,
		placeholder,
		fontFamily,
		isMovingLabel,
		button,
		formId,
		dispatch,
		randomFormId,
		randomInputId,
		formDomContent,
		inputDomContent,
		$valueW,
		$isActiveW,
		$hintW
	});

	$$self.$inject_state = $$new_props => {
		if ("value" in $$props) $$invalidate(0, value = $$new_props.value);
		if ("valueW" in $$props) $$subscribe_valueW($$invalidate(2, valueW = $$new_props.valueW));
		if ("isActive" in $$props) $$invalidate(38, isActive = $$new_props.isActive);
		if ("isActiveW" in $$props) $$subscribe_isActiveW($$invalidate(3, isActiveW = $$new_props.isActiveW));
		if ("onFocus" in $$props) $$invalidate(5, onFocus = $$new_props.onFocus);
		if ("onBlur" in $$props) $$invalidate(6, onBlur = $$new_props.onBlur);
		if ("label" in $$props) $$invalidate(7, label = $$new_props.label);
		if ("buttonComponent" in $$props) $$invalidate(8, buttonComponent = $$new_props.buttonComponent);
		if ("buttonProps" in $$props) $$invalidate(9, buttonProps = $$new_props.buttonProps);
		if ("hintLevelW" in $$props) $$invalidate(10, hintLevelW = $$new_props.hintLevelW);
		if ("hintW" in $$props) $$subscribe_hintW($$invalidate(11, hintW = $$new_props.hintW));
		if ("depth" in $$props) $$invalidate(41, depth = $$new_props.depth);
		if ("roundness" in $$props) $$invalidate(12, roundness = $$new_props.roundness);
		if ("height" in $$props) $$invalidate(13, height = $$new_props.height);
		if ("width" in $$props) $$invalidate(14, width = $$new_props.width);
		if ("buttonWidth" in $$props) $$invalidate(15, buttonWidth = $$new_props.buttonWidth);
		if ("fontSize" in $$props) $$invalidate(16, fontSize = $$new_props.fontSize);
		if ("labelFontSize" in $$props) $$invalidate(17, labelFontSize = $$new_props.labelFontSize);
		if ("labelTop" in $$props) $$invalidate(18, labelTop = $$new_props.labelTop);
		if ("minIndent" in $$props) $$invalidate(19, minIndent = $$new_props.minIndent);
		if ("indent" in $$props) $$invalidate(20, indent = $$new_props.indent);
		if ("backgroundColour" in $$props) $$invalidate(21, backgroundColour = $$new_props.backgroundColour);
		if ("activeBackgroundColour" in $$props) $$invalidate(22, activeBackgroundColour = $$new_props.activeBackgroundColour);
		if ("textColour" in $$props) $$invalidate(23, textColour = $$new_props.textColour);
		if ("labelColour" in $$props) $$invalidate(24, labelColour = $$new_props.labelColour);
		if ("floatingLabelIndent" in $$props) $$invalidate(25, floatingLabelIndent = $$new_props.floatingLabelIndent);
		if ("placeholder" in $$props) $$invalidate(26, placeholder = $$new_props.placeholder);
		if ("fontFamily" in $$props) $$invalidate(27, fontFamily = $$new_props.fontFamily);
		if ("isMovingLabel" in $$props) $$invalidate(28, isMovingLabel = $$new_props.isMovingLabel);
		if ("button" in $$props) $$invalidate(1, button = $$new_props.button);
		if ("formId" in $$props) $$invalidate(29, formId = $$new_props.formId);
		if ("formDomContent" in $$props) $$invalidate(31, formDomContent = $$new_props.formDomContent);
		if ("inputDomContent" in $$props) $$invalidate(32, inputDomContent = $$new_props.inputDomContent);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty[0] & /*$valueW*/ 1073741824) {
			$: $$invalidate(0, value = $valueW);
		}

		if ($$self.$$.dirty[0] & /*valueW, value*/ 5) {
			$: valueW.set(value);
		}
	};

	return [
		value,
		button,
		valueW,
		isActiveW,
		submit,
		onFocus,
		onBlur,
		label,
		buttonComponent,
		buttonProps,
		hintLevelW,
		hintW,
		roundness,
		height,
		width,
		buttonWidth,
		fontSize,
		labelFontSize,
		labelTop,
		minIndent,
		indent,
		backgroundColour,
		activeBackgroundColour,
		textColour,
		labelColour,
		floatingLabelIndent,
		placeholder,
		fontFamily,
		isMovingLabel,
		formId,
		$valueW,
		formDomContent,
		inputDomContent,
		$isActiveW,
		$hintW,
		randomFormId,
		randomInputId,
		$$restProps,
		isActive,
		focus,
		blur,
		depth,
		slots,
		input_input_handler,
		input_binding,
		switch_instance_binding,
		button_1_binding,
		form_binding,
		$$scope
	];
}

class Input extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(
			this,
			options,
			instance$g,
			create_fragment$g,
			safe_not_equal,
			{
				value: 0,
				valueW: 2,
				isActive: 38,
				isActiveW: 3,
				focus: 39,
				submit: 4,
				blur: 40,
				onFocus: 5,
				onBlur: 6,
				label: 7,
				buttonComponent: 8,
				buttonProps: 9,
				hintLevelW: 10,
				hintW: 11,
				depth: 41,
				roundness: 12,
				height: 13,
				width: 14,
				buttonWidth: 15,
				fontSize: 16,
				labelFontSize: 17,
				labelTop: 18,
				minIndent: 19,
				indent: 20,
				backgroundColour: 21,
				activeBackgroundColour: 22,
				textColour: 23,
				labelColour: 24,
				floatingLabelIndent: 25,
				placeholder: 26,
				fontFamily: 27,
				isMovingLabel: 28,
				button: 1,
				formId: 29
			},
			[-1, -1]
		);

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Input",
			options,
			id: create_fragment$g.name
		});
	}

	get value() {
		return this.$$.ctx[0];
	}

	set value(value) {
		this.$set({ value });
		flush();
	}

	get valueW() {
		return this.$$.ctx[2];
	}

	set valueW(valueW) {
		this.$set({ valueW });
		flush();
	}

	get isActive() {
		return this.$$.ctx[38];
	}

	set isActive(isActive) {
		this.$set({ isActive });
		flush();
	}

	get isActiveW() {
		return this.$$.ctx[3];
	}

	set isActiveW(isActiveW) {
		this.$set({ isActiveW });
		flush();
	}

	get focus() {
		return this.$$.ctx[39];
	}

	set focus(value) {
		throw new Error("<Input>: Cannot set read-only property 'focus'");
	}

	get submit() {
		return this.$$.ctx[4];
	}

	set submit(value) {
		throw new Error("<Input>: Cannot set read-only property 'submit'");
	}

	get blur() {
		return this.$$.ctx[40];
	}

	set blur(value) {
		throw new Error("<Input>: Cannot set read-only property 'blur'");
	}

	get onFocus() {
		return this.$$.ctx[5];
	}

	set onFocus(onFocus) {
		this.$set({ onFocus });
		flush();
	}

	get onBlur() {
		return this.$$.ctx[6];
	}

	set onBlur(onBlur) {
		this.$set({ onBlur });
		flush();
	}

	get label() {
		return this.$$.ctx[7];
	}

	set label(label) {
		this.$set({ label });
		flush();
	}

	get buttonComponent() {
		return this.$$.ctx[8];
	}

	set buttonComponent(buttonComponent) {
		this.$set({ buttonComponent });
		flush();
	}

	get buttonProps() {
		return this.$$.ctx[9];
	}

	set buttonProps(buttonProps) {
		this.$set({ buttonProps });
		flush();
	}

	get hintLevelW() {
		return this.$$.ctx[10];
	}

	set hintLevelW(hintLevelW) {
		this.$set({ hintLevelW });
		flush();
	}

	get hintW() {
		return this.$$.ctx[11];
	}

	set hintW(hintW) {
		this.$set({ hintW });
		flush();
	}

	get depth() {
		return this.$$.ctx[41];
	}

	set depth(depth) {
		this.$set({ depth });
		flush();
	}

	get roundness() {
		return this.$$.ctx[12];
	}

	set roundness(roundness) {
		this.$set({ roundness });
		flush();
	}

	get height() {
		return this.$$.ctx[13];
	}

	set height(height) {
		this.$set({ height });
		flush();
	}

	get width() {
		return this.$$.ctx[14];
	}

	set width(width) {
		this.$set({ width });
		flush();
	}

	get buttonWidth() {
		return this.$$.ctx[15];
	}

	set buttonWidth(buttonWidth) {
		this.$set({ buttonWidth });
		flush();
	}

	get fontSize() {
		return this.$$.ctx[16];
	}

	set fontSize(fontSize) {
		this.$set({ fontSize });
		flush();
	}

	get labelFontSize() {
		return this.$$.ctx[17];
	}

	set labelFontSize(labelFontSize) {
		this.$set({ labelFontSize });
		flush();
	}

	get labelTop() {
		return this.$$.ctx[18];
	}

	set labelTop(labelTop) {
		this.$set({ labelTop });
		flush();
	}

	get minIndent() {
		return this.$$.ctx[19];
	}

	set minIndent(minIndent) {
		this.$set({ minIndent });
		flush();
	}

	get indent() {
		return this.$$.ctx[20];
	}

	set indent(indent) {
		this.$set({ indent });
		flush();
	}

	get backgroundColour() {
		return this.$$.ctx[21];
	}

	set backgroundColour(backgroundColour) {
		this.$set({ backgroundColour });
		flush();
	}

	get activeBackgroundColour() {
		return this.$$.ctx[22];
	}

	set activeBackgroundColour(activeBackgroundColour) {
		this.$set({ activeBackgroundColour });
		flush();
	}

	get textColour() {
		return this.$$.ctx[23];
	}

	set textColour(textColour) {
		this.$set({ textColour });
		flush();
	}

	get labelColour() {
		return this.$$.ctx[24];
	}

	set labelColour(labelColour) {
		this.$set({ labelColour });
		flush();
	}

	get floatingLabelIndent() {
		return this.$$.ctx[25];
	}

	set floatingLabelIndent(floatingLabelIndent) {
		this.$set({ floatingLabelIndent });
		flush();
	}

	get placeholder() {
		return this.$$.ctx[26];
	}

	set placeholder(placeholder) {
		this.$set({ placeholder });
		flush();
	}

	get fontFamily() {
		return this.$$.ctx[27];
	}

	set fontFamily(fontFamily) {
		this.$set({ fontFamily });
		flush();
	}

	get isMovingLabel() {
		return this.$$.ctx[28];
	}

	set isMovingLabel(isMovingLabel) {
		this.$set({ isMovingLabel });
		flush();
	}

	get button() {
		return this.$$.ctx[1];
	}

	set button(button) {
		this.$set({ button });
		flush();
	}

	get formId() {
		return this.$$.ctx[29];
	}

	set formId(formId) {
		this.$set({ formId });
		flush();
	}
}

class TransitionerResultItem extends Item {
    delay = 0;
    duration = 200;
    easing = quintInOut;
    css = (() => { });
    tick = undefined;
}

class Transitioner {
    isInRegistered = false;
    isOutRegistered = false;
    inIndex = 0;
    outIndex = 0;
    inLength = 0;
    outLength = 0;
    // use arrow functions to keep 'this' bound
    // even if destructured
    t = () => {
        let index = this.inIndex % this.inLength;
        if (!this.isInRegistered) {
            index = this.inLength++;
            setTimeout(() => {
                this.isInRegistered = true;
            }, 0);
        }
        ++this.inIndex;
        return {
            delay: index * 50,
        };
    };
    tt = () => {
        let index = this.outIndex % this.outLength;
        if (!this.isOutRegistered) {
            index = this.outLength++;
            setTimeout(() => {
                this.isOutRegistered = true;
            }, 0);
        }
        ++this.outIndex;
        return {
            delay: index * 50,
        };
    };
    static noop() {
        return TransitionerResultItem.from({
            delay: 0,
            duration: 0,
            easing: (t) => t,
            css: () => '',
        });
    }
    static fade(element, { delay = 0, duration = 200, easing = quintInOut, }, tick) {
        const { opacity, } = getComputedStyle(element);
        return TransitionerResultItem.from({
            delay,
            duration,
            easing,
            css: (t) => `opacity: ${t * +opacity}`,
            tick,
        });
    }
    static fadeIn(element, options) {
        Ctx.isInAnimationRunning = true;
        return Transitioner.fade(element, {
            easing: quintOut,
            ...options,
        }, Transitioner.onInTick);
    }
    static fadeOut(element, options) {
        Ctx.isInAnimationRunning = true;
        return Transitioner.fade(element, {
            easing: quintIn,
            ...options,
        }, Transitioner.onOutTick);
    }
    static dropIn(element, { delay = 0, duration = 500, easing = expoOut, }) {
        const computed = getComputedStyle(element);
        const opacity = Number(computed.opacity);
        const transform = computed.transform === 'none'
            ? ''
            : computed.transform;
        Ctx.isInAnimationRunning = true;
        return TransitionerResultItem.from({
            delay,
            duration,
            easing,
            css: (t, u) => `
				transform: ${transform} translateY(${u * -20}px);
				opacity: ${opacity * Math.min(t * 2, 1)};
			`,
            tick: Transitioner.onInTick,
        });
    }
    static dropOut(element, { delay = 0, duration = 200, easing = expoIn, }) {
        const computed = getComputedStyle(element);
        const opacity = Number(computed.opacity);
        const transform = computed.transform === 'none'
            ? ''
            : computed.transform;
        Ctx.isOutAnimationRunning = true;
        return TransitionerResultItem.from({
            delay,
            duration,
            easing,
            css: (t, u) => `
				transform: ${transform} translateY(${u * -20}px);
				opacity: ${opacity * t};
			`,
            tick: Transitioner.onOutTick,
        });
    }
    static onInTick(t) {
        if (t !== 1) {
            return;
        }
        Ctx.isInAnimationRunning = false;
    }
    static onOutTick(t) {
        if (t !== 0) {
            return;
        }
        Ctx.isOutAnimationRunning = false;
    }
}
const { fade, fadeIn, fadeOut, dropIn, dropOut, noop, } = Transitioner;

var undefined$f = undefined;

/* src\ui\blocks\Fragment.svelte generated by Svelte v3.38.2 */
const file$f = "src\\ui\\blocks\\Fragment.svelte";

// (78:8)      
function fallback_block$1(ctx) {
	let container;
	let string;

	const block = {
		c: function create() {
			container = element("container");
			string = element("string");
			string.textContent = `${strings.ui.scenes.common.warn.EMPTY_SCENE}`;
			attr_dev(string, "class", "svelte-19hd9uy");
			add_location(string, file$f, 79, 4, 2409);
			attr_dev(container, "class", "placeholder svelte-19hd9uy");
			add_location(container, file$f, 78, 3, 2372);
		},
		m: function mount(target, anchor) {
			insert_dev(target, container, anchor);
			append_dev(container, string);
		},
		p: noop$1,
		d: function destroy(detaching) {
			if (detaching) detach_dev(container);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: fallback_block$1.name,
		type: "fallback",
		source: "(78:8)      ",
		ctx
	});

	return block;
}

function create_fragment$f(ctx) {
	let component;
	let container;
	let component_intro;
	let component_outro;
	let current;
	let mounted;
	let dispose;
	const default_slot_template = /*#slots*/ ctx[23].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[22], null);
	const default_slot_or_fallback = default_slot || fallback_block$1(ctx);

	const block = {
		c: function create() {
			component = element("component");
			container = element("container");
			if (default_slot_or_fallback) default_slot_or_fallback.c();
			attr_dev(container, "class", "content svelte-19hd9uy");
			set_style(container, "--columns", /*columns*/ ctx[0]);
			set_style(container, "--rows", /*rows*/ ctx[1]);
			set_style(container, "--gap", /*gap*/ ctx[2]);
			set_style(container, "--is-or-not-padding", /*isPadded*/ ctx[7] ? "var(--padding)" : "0px");
			set_style(container, "--colour-background", CSSUtility.parse(/*backgroundColour*/ ctx[8]));
			set_style(container, "--border-radius", CSSUtility.parse(/*borderRadius*/ ctx[9]));
			set_style(container, "--overflow-y", /*$isScrollableW*/ ctx[13] ? "auto" : "unset");
			add_location(container, file$f, 65, 1, 2007);
			set_style(component, "--width", CSSUtility.parse(/*width*/ ctx[5]));
			set_style(component, "--height", CSSUtility.parse(/*height*/ ctx[6]));
			set_style(component, "--align", CSSUtility.parse(/*align*/ ctx[4]));
			set_style(component, "--justify", CSSUtility.parse(/*justify*/ ctx[3]));
			attr_dev(component, "class", "svelte-19hd9uy");
			add_location(component, file$f, 37, 0, 1308);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, component, anchor);
			append_dev(component, container);

			if (default_slot_or_fallback) {
				default_slot_or_fallback.m(container, null);
			}

			/*component_binding*/ ctx[28](component);
			current = true;

			if (!mounted) {
				dispose = [
					listen_dev(component, "introstart", /*introstart_handler*/ ctx[24], false, false, false),
					listen_dev(component, "introend", /*introend_handler*/ ctx[25], false, false, false),
					listen_dev(component, "outrostart", /*outrostart_handler*/ ctx[26], false, false, false),
					listen_dev(component, "outroend", /*outroend_handler*/ ctx[27], false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 4194304)) {
					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[22], dirty, null, null);
				}
			}

			if (!current || dirty & /*columns*/ 1) {
				set_style(container, "--columns", /*columns*/ ctx[0]);
			}

			if (!current || dirty & /*rows*/ 2) {
				set_style(container, "--rows", /*rows*/ ctx[1]);
			}

			if (!current || dirty & /*gap*/ 4) {
				set_style(container, "--gap", /*gap*/ ctx[2]);
			}

			if (!current || dirty & /*isPadded*/ 128) {
				set_style(container, "--is-or-not-padding", /*isPadded*/ ctx[7] ? "var(--padding)" : "0px");
			}

			if (!current || dirty & /*backgroundColour*/ 256) {
				set_style(container, "--colour-background", CSSUtility.parse(/*backgroundColour*/ ctx[8]));
			}

			if (!current || dirty & /*borderRadius*/ 512) {
				set_style(container, "--border-radius", CSSUtility.parse(/*borderRadius*/ ctx[9]));
			}

			if (!current || dirty & /*$isScrollableW*/ 8192) {
				set_style(container, "--overflow-y", /*$isScrollableW*/ ctx[13] ? "auto" : "unset");
			}

			if (!current || dirty & /*width*/ 32) {
				set_style(component, "--width", CSSUtility.parse(/*width*/ ctx[5]));
			}

			if (!current || dirty & /*height*/ 64) {
				set_style(component, "--height", CSSUtility.parse(/*height*/ ctx[6]));
			}

			if (!current || dirty & /*align*/ 16) {
				set_style(component, "--align", CSSUtility.parse(/*align*/ ctx[4]));
			}

			if (!current || dirty & /*justify*/ 8) {
				set_style(component, "--justify", CSSUtility.parse(/*justify*/ ctx[3]));
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot_or_fallback, local);

			add_render_callback(() => {
				if (component_outro) component_outro.end(1);
				if (!component_intro) component_intro = create_in_transition(component, /*dropIn*/ ctx[14], {});
				component_intro.start();
			});

			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot_or_fallback, local);
			if (component_intro) component_intro.invalidate();
			component_outro = create_out_transition(component, /*dropOut*/ ctx[15], {});
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(component);
			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
			/*component_binding*/ ctx[28](null);
			if (detaching && component_outro) component_outro.end();
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$f.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$f($$self, $$props, $$invalidate) {
	let $isSceneOutAnimationRunning;

	let $isScrollableW,
		$$unsubscribe_isScrollableW = noop$1,
		$$subscribe_isScrollableW = () => ($$unsubscribe_isScrollableW(), $$unsubscribe_isScrollableW = subscribe(isScrollableW, $$value => $$invalidate(13, $isScrollableW = $$value)), isScrollableW);

	$$self.$$.on_destroy.push(() => $$unsubscribe_isScrollableW());
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("Fragment", slots, ['default']);
	
	let { columns = "auto" } = $$props;
	let { rows = "auto" } = $$props;
	let { gap = 0 } = $$props;
	let { justify = "start" } = $$props;
	let { align = "center" } = $$props;
	let { width = "auto" } = $$props;
	let { height = "auto" } = $$props;
	let { isPadded = true } = $$props;
	let { backgroundColour = "--colour-background-primary" } = $$props;
	let { isInAnimated = false } = $$props;
	let { isOutAnimated = false } = $$props;
	let { borderRadius = 0 } = $$props;
	let { isScrollable = false } = $$props;
	let { isScrollableW = writable(isScrollable) } = $$props;
	validate_store(isScrollableW, "isScrollableW");
	$$subscribe_isScrollableW();
	const dropIn$1 = isInAnimated ? dropIn : noop;
	const dropOut$1 = isOutAnimated ? dropOut : noop;
	const { isSceneOutAnimationRunning, isSceneInAnimationRunning } = Ctx.s;
	validate_store(isSceneOutAnimationRunning, "isSceneOutAnimationRunning");
	component_subscribe($$self, isSceneOutAnimationRunning, value => $$invalidate(21, $isSceneOutAnimationRunning = value));
	let componentDomContent;
	let isLocalInAnimationRunning = false;

	const writable_props = [
		"columns",
		"rows",
		"gap",
		"justify",
		"align",
		"width",
		"height",
		"isPadded",
		"backgroundColour",
		"isInAnimated",
		"isOutAnimated",
		"borderRadius",
		"isScrollable",
		"isScrollableW"
	];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Fragment> was created with unknown prop '${key}'`);
	});

	const introstart_handler = () => {
		isSceneInAnimationRunning.set($$invalidate(12, isLocalInAnimationRunning = true));
	};

	const introend_handler = () => {
		// eslint-disable-next-line no-unused-vars
		isSceneInAnimationRunning.set($$invalidate(12, isLocalInAnimationRunning = false));
	};

	const outrostart_handler = () => {
		isSceneOutAnimationRunning.set(true);
	}; // ScrollUtility.disable();

	const outroend_handler = () => {
		isSceneOutAnimationRunning.set(false);
	}; // ScrollUtility.enable();

	function component_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			componentDomContent = $$value;
			(((($$invalidate(11, componentDomContent), $$invalidate(18, isInAnimated)), $$invalidate(19, isOutAnimated)), $$invalidate(21, $isSceneOutAnimationRunning)), $$invalidate(12, isLocalInAnimationRunning));
		});
	}

	$$self.$$set = $$props => {
		if ("columns" in $$props) $$invalidate(0, columns = $$props.columns);
		if ("rows" in $$props) $$invalidate(1, rows = $$props.rows);
		if ("gap" in $$props) $$invalidate(2, gap = $$props.gap);
		if ("justify" in $$props) $$invalidate(3, justify = $$props.justify);
		if ("align" in $$props) $$invalidate(4, align = $$props.align);
		if ("width" in $$props) $$invalidate(5, width = $$props.width);
		if ("height" in $$props) $$invalidate(6, height = $$props.height);
		if ("isPadded" in $$props) $$invalidate(7, isPadded = $$props.isPadded);
		if ("backgroundColour" in $$props) $$invalidate(8, backgroundColour = $$props.backgroundColour);
		if ("isInAnimated" in $$props) $$invalidate(18, isInAnimated = $$props.isInAnimated);
		if ("isOutAnimated" in $$props) $$invalidate(19, isOutAnimated = $$props.isOutAnimated);
		if ("borderRadius" in $$props) $$invalidate(9, borderRadius = $$props.borderRadius);
		if ("isScrollable" in $$props) $$invalidate(20, isScrollable = $$props.isScrollable);
		if ("isScrollableW" in $$props) $$subscribe_isScrollableW($$invalidate(10, isScrollableW = $$props.isScrollableW));
		if ("$$scope" in $$props) $$invalidate(22, $$scope = $$props.$$scope);
	};

	$$self.$capture_state = () => ({
		writable,
		strings,
		CSSUtility,
		dropInRaw: dropIn,
		dropOutRaw: dropOut,
		noop,
		Ctx,
		columns,
		rows,
		gap,
		justify,
		align,
		width,
		height,
		isPadded,
		backgroundColour,
		isInAnimated,
		isOutAnimated,
		borderRadius,
		isScrollable,
		isScrollableW,
		dropIn: dropIn$1,
		dropOut: dropOut$1,
		isSceneOutAnimationRunning,
		isSceneInAnimationRunning,
		componentDomContent,
		isLocalInAnimationRunning,
		$isSceneOutAnimationRunning,
		$isScrollableW
	});

	$$self.$inject_state = $$props => {
		if ("columns" in $$props) $$invalidate(0, columns = $$props.columns);
		if ("rows" in $$props) $$invalidate(1, rows = $$props.rows);
		if ("gap" in $$props) $$invalidate(2, gap = $$props.gap);
		if ("justify" in $$props) $$invalidate(3, justify = $$props.justify);
		if ("align" in $$props) $$invalidate(4, align = $$props.align);
		if ("width" in $$props) $$invalidate(5, width = $$props.width);
		if ("height" in $$props) $$invalidate(6, height = $$props.height);
		if ("isPadded" in $$props) $$invalidate(7, isPadded = $$props.isPadded);
		if ("backgroundColour" in $$props) $$invalidate(8, backgroundColour = $$props.backgroundColour);
		if ("isInAnimated" in $$props) $$invalidate(18, isInAnimated = $$props.isInAnimated);
		if ("isOutAnimated" in $$props) $$invalidate(19, isOutAnimated = $$props.isOutAnimated);
		if ("borderRadius" in $$props) $$invalidate(9, borderRadius = $$props.borderRadius);
		if ("isScrollable" in $$props) $$invalidate(20, isScrollable = $$props.isScrollable);
		if ("isScrollableW" in $$props) $$subscribe_isScrollableW($$invalidate(10, isScrollableW = $$props.isScrollableW));
		if ("componentDomContent" in $$props) $$invalidate(11, componentDomContent = $$props.componentDomContent);
		if ("isLocalInAnimationRunning" in $$props) $$invalidate(12, isLocalInAnimationRunning = $$props.isLocalInAnimationRunning);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*isInAnimated, isOutAnimated, componentDomContent, $isSceneOutAnimationRunning, isLocalInAnimationRunning*/ 2889728) {
			$: if ((isInAnimated || isOutAnimated) && componentDomContent) {
				if ($isSceneOutAnimationRunning && isLocalInAnimationRunning) {
					$$invalidate(11, componentDomContent.style.display = "none", componentDomContent);
				} else {
					$$invalidate(11, componentDomContent.style.display = "", componentDomContent);
				}
			}
		}
	};

	return [
		columns,
		rows,
		gap,
		justify,
		align,
		width,
		height,
		isPadded,
		backgroundColour,
		borderRadius,
		isScrollableW,
		componentDomContent,
		isLocalInAnimationRunning,
		$isScrollableW,
		dropIn$1,
		dropOut$1,
		isSceneOutAnimationRunning,
		isSceneInAnimationRunning,
		isInAnimated,
		isOutAnimated,
		isScrollable,
		$isSceneOutAnimationRunning,
		$$scope,
		slots,
		introstart_handler,
		introend_handler,
		outrostart_handler,
		outroend_handler,
		component_binding
	];
}

class Fragment extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$f, create_fragment$f, safe_not_equal, {
			columns: 0,
			rows: 1,
			gap: 2,
			justify: 3,
			align: 4,
			width: 5,
			height: 6,
			isPadded: 7,
			backgroundColour: 8,
			isInAnimated: 18,
			isOutAnimated: 19,
			borderRadius: 9,
			isScrollable: 20,
			isScrollableW: 10
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Fragment",
			options,
			id: create_fragment$f.name
		});
	}

	get columns() {
		return this.$$.ctx[0];
	}

	set columns(columns) {
		this.$set({ columns });
		flush();
	}

	get rows() {
		return this.$$.ctx[1];
	}

	set rows(rows) {
		this.$set({ rows });
		flush();
	}

	get gap() {
		return this.$$.ctx[2];
	}

	set gap(gap) {
		this.$set({ gap });
		flush();
	}

	get justify() {
		return this.$$.ctx[3];
	}

	set justify(justify) {
		this.$set({ justify });
		flush();
	}

	get align() {
		return this.$$.ctx[4];
	}

	set align(align) {
		this.$set({ align });
		flush();
	}

	get width() {
		return this.$$.ctx[5];
	}

	set width(width) {
		this.$set({ width });
		flush();
	}

	get height() {
		return this.$$.ctx[6];
	}

	set height(height) {
		this.$set({ height });
		flush();
	}

	get isPadded() {
		return this.$$.ctx[7];
	}

	set isPadded(isPadded) {
		this.$set({ isPadded });
		flush();
	}

	get backgroundColour() {
		return this.$$.ctx[8];
	}

	set backgroundColour(backgroundColour) {
		this.$set({ backgroundColour });
		flush();
	}

	get isInAnimated() {
		return this.$$.ctx[18];
	}

	set isInAnimated(isInAnimated) {
		this.$set({ isInAnimated });
		flush();
	}

	get isOutAnimated() {
		return this.$$.ctx[19];
	}

	set isOutAnimated(isOutAnimated) {
		this.$set({ isOutAnimated });
		flush();
	}

	get borderRadius() {
		return this.$$.ctx[9];
	}

	set borderRadius(borderRadius) {
		this.$set({ borderRadius });
		flush();
	}

	get isScrollable() {
		return this.$$.ctx[20];
	}

	set isScrollable(isScrollable) {
		this.$set({ isScrollable });
		flush();
	}

	get isScrollableW() {
		return this.$$.ctx[10];
	}

	set isScrollableW(isScrollableW) {
		this.$set({ isScrollableW });
		flush();
	}
}

var undefined$e = undefined;

/* src\ui\blocks\Dialog.svelte generated by Svelte v3.38.2 */
const file$e = "src\\ui\\blocks\\Dialog.svelte";

// (26:0) {#if $isActiveW}
function create_if_block$3(ctx) {
	let component;
	let overlay;
	let overlay_transition;
	let t;
	let container;
	let component_intro;
	let component_outro;
	let current;
	let mounted;
	let dispose;
	const default_slot_template = /*#slots*/ ctx[13].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);

	const block = {
		c: function create() {
			component = element("component");
			overlay = element("overlay");
			t = space();
			container = element("container");
			if (default_slot) default_slot.c();
			add_location(overlay, file$e, 35, 3, 1031);
			attr_dev(container, "class", "content svelte-ptnajd");
			set_style(container, "--border-radius", CSSUtility.parse(/*roundness*/ ctx[1]));
			set_style(container, "--max-height", CSSUtility.parse(/*maxHeight*/ ctx[2]));
			toggle_class(container, "inactive", !/*$isActiveW*/ ctx[7]);
			add_location(container, file$e, 40, 3, 1130);
			attr_dev(component, "class", "svelte-ptnajd");
			toggle_class(component, "inactive", !/*$isActiveW*/ ctx[7]);
			add_location(component, file$e, 26, 1, 891);
		},
		m: function mount(target, anchor) {
			insert_dev(target, component, anchor);
			append_dev(component, overlay);
			/*overlay_binding*/ ctx[14](overlay);
			append_dev(component, t);
			append_dev(component, container);

			if (default_slot) {
				default_slot.m(container, null);
			}

			/*container_binding*/ ctx[15](container);
			/*component_binding*/ ctx[16](component);
			current = true;

			if (!mounted) {
				dispose = listen_dev(
					overlay,
					"click",
					function () {
						if (is_function(/*onBlur*/ ctx[3])) /*onBlur*/ ctx[3].apply(this, arguments);
					},
					false,
					false,
					false
				);

				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;

			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[12], dirty, null, null);
				}
			}

			if (!current || dirty & /*roundness*/ 2) {
				set_style(container, "--border-radius", CSSUtility.parse(/*roundness*/ ctx[1]));
			}

			if (!current || dirty & /*maxHeight*/ 4) {
				set_style(container, "--max-height", CSSUtility.parse(/*maxHeight*/ ctx[2]));
			}

			if (dirty & /*$isActiveW*/ 128) {
				toggle_class(container, "inactive", !/*$isActiveW*/ ctx[7]);
			}

			if (dirty & /*$isActiveW*/ 128) {
				toggle_class(component, "inactive", !/*$isActiveW*/ ctx[7]);
			}
		},
		i: function intro(local) {
			if (current) return;

			add_render_callback(() => {
				if (!overlay_transition) overlay_transition = create_bidirectional_transition(overlay, fade, {}, true);
				overlay_transition.run(1);
			});

			transition_in(default_slot, local);

			add_render_callback(() => {
				if (component_outro) component_outro.end(1);
				if (!component_intro) component_intro = create_in_transition(component, dropIn, {});
				component_intro.start();
			});

			current = true;
		},
		o: function outro(local) {
			if (!overlay_transition) overlay_transition = create_bidirectional_transition(overlay, fade, {}, false);
			overlay_transition.run(0);
			transition_out(default_slot, local);
			if (component_intro) component_intro.invalidate();
			component_outro = create_out_transition(component, dropOut, { duration: 100 });
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(component);
			/*overlay_binding*/ ctx[14](null);
			if (detaching && overlay_transition) overlay_transition.end();
			if (default_slot) default_slot.d(detaching);
			/*container_binding*/ ctx[15](null);
			/*component_binding*/ ctx[16](null);
			if (detaching && component_outro) component_outro.end();
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$3.name,
		type: "if",
		source: "(26:0) {#if $isActiveW}",
		ctx
	});

	return block;
}

function create_fragment$e(ctx) {
	let if_block_anchor;
	let current;
	let if_block = /*$isActiveW*/ ctx[7] && create_if_block$3(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (/*$isActiveW*/ ctx[7]) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*$isActiveW*/ 128) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block$3(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$e.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$e($$self, $$props, $$invalidate) {
	let $isActiveW,
		$$unsubscribe_isActiveW = noop$1,
		$$subscribe_isActiveW = () => ($$unsubscribe_isActiveW(), $$unsubscribe_isActiveW = subscribe(isActiveW, $$value => $$invalidate(7, $isActiveW = $$value)), isActiveW);

	$$self.$$.on_destroy.push(() => $$unsubscribe_isActiveW());
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("Dialog", slots, ['default']);
	let { depth = 3 } = $$props;
	let { isDismissingOnBlur = false } = $$props;
	let { isActive = true } = $$props;
	let { isActiveW = writable(isActive) } = $$props;
	validate_store(isActiveW, "isActiveW");
	$$subscribe_isActiveW();
	let { roundness = "--roundness" } = $$props;
	let { maxHeight = "calc(100vh - var(--padding))" } = $$props;

	function dismiss() {
		onBlur();
	}

	let { onBlur = () => {
		if (isDismissingOnBlur) {
			isActiveW.set(false);
		}
	} } = $$props;

	let contentDomContent;
	let allDomContent;
	let overlayDomContent;

	const writable_props = [
		"depth",
		"isDismissingOnBlur",
		"isActive",
		"isActiveW",
		"roundness",
		"maxHeight",
		"onBlur"
	];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Dialog> was created with unknown prop '${key}'`);
	});

	function overlay_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			overlayDomContent = $$value;
			$$invalidate(6, overlayDomContent);
		});
	}

	function container_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			contentDomContent = $$value;
			$$invalidate(4, contentDomContent);
		});
	}

	function component_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			allDomContent = $$value;
			$$invalidate(5, allDomContent);
		});
	}

	$$self.$$set = $$props => {
		if ("depth" in $$props) $$invalidate(8, depth = $$props.depth);
		if ("isDismissingOnBlur" in $$props) $$invalidate(9, isDismissingOnBlur = $$props.isDismissingOnBlur);
		if ("isActive" in $$props) $$invalidate(10, isActive = $$props.isActive);
		if ("isActiveW" in $$props) $$subscribe_isActiveW($$invalidate(0, isActiveW = $$props.isActiveW));
		if ("roundness" in $$props) $$invalidate(1, roundness = $$props.roundness);
		if ("maxHeight" in $$props) $$invalidate(2, maxHeight = $$props.maxHeight);
		if ("onBlur" in $$props) $$invalidate(3, onBlur = $$props.onBlur);
		if ("$$scope" in $$props) $$invalidate(12, $$scope = $$props.$$scope);
	};

	$$self.$capture_state = () => ({
		writable,
		Shadow,
		CSSUtility,
		fade,
		dropIn,
		dropOut,
		depth,
		isDismissingOnBlur,
		isActive,
		isActiveW,
		roundness,
		maxHeight,
		dismiss,
		onBlur,
		contentDomContent,
		allDomContent,
		overlayDomContent,
		$isActiveW
	});

	$$self.$inject_state = $$props => {
		if ("depth" in $$props) $$invalidate(8, depth = $$props.depth);
		if ("isDismissingOnBlur" in $$props) $$invalidate(9, isDismissingOnBlur = $$props.isDismissingOnBlur);
		if ("isActive" in $$props) $$invalidate(10, isActive = $$props.isActive);
		if ("isActiveW" in $$props) $$subscribe_isActiveW($$invalidate(0, isActiveW = $$props.isActiveW));
		if ("roundness" in $$props) $$invalidate(1, roundness = $$props.roundness);
		if ("maxHeight" in $$props) $$invalidate(2, maxHeight = $$props.maxHeight);
		if ("onBlur" in $$props) $$invalidate(3, onBlur = $$props.onBlur);
		if ("contentDomContent" in $$props) $$invalidate(4, contentDomContent = $$props.contentDomContent);
		if ("allDomContent" in $$props) $$invalidate(5, allDomContent = $$props.allDomContent);
		if ("overlayDomContent" in $$props) $$invalidate(6, overlayDomContent = $$props.overlayDomContent);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*contentDomContent, depth*/ 272) {
			$: contentDomContent && Shadow.apply(depth, contentDomContent);
		}

		if ($$self.$$.dirty & /*allDomContent, onBlur*/ 40) {
			$: allDomContent === null || allDomContent === void 0
			? void 0
			: allDomContent.addEventListener("dismiss", onBlur);
		}
	};

	return [
		isActiveW,
		roundness,
		maxHeight,
		onBlur,
		contentDomContent,
		allDomContent,
		overlayDomContent,
		$isActiveW,
		depth,
		isDismissingOnBlur,
		isActive,
		dismiss,
		$$scope,
		slots,
		overlay_binding,
		container_binding,
		component_binding
	];
}

class Dialog extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$e, create_fragment$e, safe_not_equal, {
			depth: 8,
			isDismissingOnBlur: 9,
			isActive: 10,
			isActiveW: 0,
			roundness: 1,
			maxHeight: 2,
			dismiss: 11,
			onBlur: 3
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Dialog",
			options,
			id: create_fragment$e.name
		});
	}

	get depth() {
		return this.$$.ctx[8];
	}

	set depth(depth) {
		this.$set({ depth });
		flush();
	}

	get isDismissingOnBlur() {
		return this.$$.ctx[9];
	}

	set isDismissingOnBlur(isDismissingOnBlur) {
		this.$set({ isDismissingOnBlur });
		flush();
	}

	get isActive() {
		return this.$$.ctx[10];
	}

	set isActive(isActive) {
		this.$set({ isActive });
		flush();
	}

	get isActiveW() {
		return this.$$.ctx[0];
	}

	set isActiveW(isActiveW) {
		this.$set({ isActiveW });
		flush();
	}

	get roundness() {
		return this.$$.ctx[1];
	}

	set roundness(roundness) {
		this.$set({ roundness });
		flush();
	}

	get maxHeight() {
		return this.$$.ctx[2];
	}

	set maxHeight(maxHeight) {
		this.$set({ maxHeight });
		flush();
	}

	get dismiss() {
		return this.$$.ctx[11];
	}

	set dismiss(value) {
		throw new Error("<Dialog>: Cannot set read-only property 'dismiss'");
	}

	get onBlur() {
		return this.$$.ctx[3];
	}

	set onBlur(onBlur) {
		this.$set({ onBlur });
		flush();
	}
}

/* eslint-disable */
/*
*   Stripe WebGl Gradient Animation
*   All Credits to Stripe.com
*   ScrollObserver functionality to disable animation when not scrolled into view has been disabled and
*   commented out for now.
*   https://kevinhufnagl.com
*/

//Converting colors to proper format
function normalizeColor(hexCode) {
	return [((hexCode >> 16) & 255) / 255, ((hexCode >> 8) & 255) / 255, (255 & hexCode) / 255];
}
["SCREEN", "LINEAR_LIGHT"].reduce(
	(hexCode, t, n) =>
		Object.assign(hexCode, {
			[t]: n,
		}),
	{}
);

// Essential functionality of WebGl
// t = width
// n = height
class MiniGl {
	constructor(canvas, width, height, debug = false) {
		const _miniGl = this,
			debug_output = -1 !== document.location.search.toLowerCase().indexOf("debug=webgl");
		(_miniGl.canvas = canvas),
			(_miniGl.gl = _miniGl.canvas.getContext("webgl", {
				antialias: true,
			})),
			(_miniGl.meshes = []);
		const context = _miniGl.gl;
		width && height && this.setSize(width, height),
			_miniGl.lastDebugMsg,
			(_miniGl.debug =
				debug && debug_output
					? function (e) {
						const t = new Date();
						t - _miniGl.lastDebugMsg > 1e3 && console.log("---"), console.log(t.toLocaleTimeString() + Array(Math.max(0, 32 - e.length)).join(" ") + e + ": ", ...Array.from(arguments).slice(1)), (_miniGl.lastDebugMsg = t);
					}
					: () => {}),
			Object.defineProperties(_miniGl, {
				Material: {
					enumerable: false,
					value: class {
						constructor(vertexShaders, fragments, uniforms = {}) {
							const material = this;
							function getShaderByType(type, source) {
								const shader = context.createShader(type);
								return (
									context.shaderSource(shader, source),
									context.compileShader(shader),
									context.getShaderParameter(shader, context.COMPILE_STATUS) || console.error(context.getShaderInfoLog(shader)),
									_miniGl.debug("Material.compileShaderSource", {
										source: source,
									}),
									shader
								);
							}
							function getUniformVariableDeclarations(uniforms, type) {
								return Object.entries(uniforms)
									.map(([uniform, value]) => value.getDeclaration(uniform, type))
									.join("\n");
							}
							(material.uniforms = uniforms), (material.uniformInstances = []);

							const prefix = "\n              precision highp float;\n            ";
							(material.vertexSource = `\n              ${prefix}\n              attribute vec4 position;\n              attribute vec2 uv;\n              attribute vec2 uvNorm;\n              ${getUniformVariableDeclarations(
								_miniGl.commonUniforms,
								"vertex"
							)}\n              ${getUniformVariableDeclarations(uniforms, "vertex")}\n              ${vertexShaders}\n            `),
								(material.Source = `\n              ${prefix}\n              ${getUniformVariableDeclarations(_miniGl.commonUniforms, "fragment")}\n              ${getUniformVariableDeclarations(
									uniforms,
									"fragment"
								)}\n              ${fragments}\n            `),
								(material.vertexShader = getShaderByType(context.VERTEX_SHADER, material.vertexSource)),
								(material.fragmentShader = getShaderByType(context.FRAGMENT_SHADER, material.Source)),
								(material.program = context.createProgram()),
								context.attachShader(material.program, material.vertexShader),
								context.attachShader(material.program, material.fragmentShader),
								context.linkProgram(material.program),
								context.getProgramParameter(material.program, context.LINK_STATUS) || console.error(context.getProgramInfoLog(material.program)),
								context.useProgram(material.program),
								material.attachUniforms(undefined, _miniGl.commonUniforms),
								material.attachUniforms(undefined, material.uniforms);
						}
						//t = uniform
						attachUniforms(name, uniforms) {
							//n  = material
							const material = this;
							undefined === name
								? Object.entries(uniforms).forEach(([name, uniform]) => {
									material.attachUniforms(name, uniform);
								})
								: "array" == uniforms.type
								? uniforms.value.forEach((uniform, i) => material.attachUniforms(`${name}[${i}]`, uniform))
								: "struct" == uniforms.type
								? Object.entries(uniforms.value).forEach(([uniform, i]) => material.attachUniforms(`${name}.${uniform}`, i))
								: (_miniGl.debug("Material.attachUniforms", {
									name: name,
									uniform: uniforms,
								}),
								material.uniformInstances.push({
									uniform: uniforms,
									location: context.getUniformLocation(material.program, name),
								}));
						}
					},
				},
				Uniform: {
					enumerable: false,
					value: class {
						constructor(e) {
							(this.type = "float"), Object.assign(this, e);
							(this.typeFn =
								{
									float: "1f",
									int: "1i",
									vec2: "2fv",
									vec3: "3fv",
									vec4: "4fv",
									mat4: "Matrix4fv",
								}[this.type] || "1f"),
								this.update();
						}
						update(value) {
							undefined !== this.value && context[`uniform${this.typeFn}`](value, 0 === this.typeFn.indexOf("Matrix") ? this.transpose : this.value, 0 === this.typeFn.indexOf("Matrix") ? this.value : null);
						}
						//e - name
						//t - type
						//n - length
						getDeclaration(name, type, length) {
							const uniform = this;
							if (uniform.excludeFrom !== type) {
								if ("array" === uniform.type) return uniform.value[0].getDeclaration(name, type, uniform.value.length) + `\nconst int ${name}_length = ${uniform.value.length};`;
								if ("struct" === uniform.type) {
									let name_no_prefix = name.replace("u_", "");
									return (
										(name_no_prefix = name_no_prefix.charAt(0).toUpperCase() + name_no_prefix.slice(1)),
										`uniform struct ${name_no_prefix} 
									{\n` +
											Object.entries(uniform.value)
												.map(([name, uniform]) => uniform.getDeclaration(name, type).replace(/^uniform/, ""))
												.join("") +
											`\n} ${name}${length > 0 ? `[${length}]` : ""};`
									);
								}
								return `uniform ${uniform.type} ${name}${length > 0 ? `[${length}]` : ""};`;
							}
						}
					},
				},
				PlaneGeometry: {
					enumerable: false,
					value: class {
						constructor(width, height, n, i, orientation) {
							context.createBuffer(),
								(this.attributes = {
									position: new _miniGl.Attribute({
										target: context.ARRAY_BUFFER,
										size: 3,
									}),
									uv: new _miniGl.Attribute({
										target: context.ARRAY_BUFFER,
										size: 2,
									}),
									uvNorm: new _miniGl.Attribute({
										target: context.ARRAY_BUFFER,
										size: 2,
									}),
									index: new _miniGl.Attribute({
										target: context.ELEMENT_ARRAY_BUFFER,
										size: 3,
										type: context.UNSIGNED_SHORT,
									}),
								}),
								this.setTopology(n, i),
								this.setSize(width, height, orientation);
						}
						setTopology(e = 1, t = 1) {
							const n = this;
							(n.xSegCount = e),
								(n.ySegCount = t),
								(n.vertexCount = (n.xSegCount + 1) * (n.ySegCount + 1)),
								(n.quadCount = n.xSegCount * n.ySegCount * 2),
								(n.attributes.uv.values = new Float32Array(2 * n.vertexCount)),
								(n.attributes.uvNorm.values = new Float32Array(2 * n.vertexCount)),
								(n.attributes.index.values = new Uint16Array(3 * n.quadCount));
							for (let e = 0; e <= n.ySegCount; e++)
								for (let t = 0; t <= n.xSegCount; t++) {
									const i = e * (n.xSegCount + 1) + t;
									if (
										((n.attributes.uv.values[2 * i] = t / n.xSegCount),
										(n.attributes.uv.values[2 * i + 1] = 1 - e / n.ySegCount),
										(n.attributes.uvNorm.values[2 * i] = (t / n.xSegCount) * 2 - 1),
										(n.attributes.uvNorm.values[2 * i + 1] = 1 - (e / n.ySegCount) * 2),
										t < n.xSegCount && e < n.ySegCount)
									) {
										const s = e * n.xSegCount + t;
										(n.attributes.index.values[6 * s] = i),
											(n.attributes.index.values[6 * s + 1] = i + 1 + n.xSegCount),
											(n.attributes.index.values[6 * s + 2] = i + 1),
											(n.attributes.index.values[6 * s + 3] = i + 1),
											(n.attributes.index.values[6 * s + 4] = i + 1 + n.xSegCount),
											(n.attributes.index.values[6 * s + 5] = i + 2 + n.xSegCount);
									}
								}
							n.attributes.uv.update(),
								n.attributes.uvNorm.update(),
								n.attributes.index.update(),
								_miniGl.debug("Geometry.setTopology", {
									uv: n.attributes.uv,
									uvNorm: n.attributes.uvNorm,
									index: n.attributes.index,
								});
						}
						setSize(width = 1, height = 1, orientation = "xz") {
							const geometry = this;
							(geometry.width = width),
								(geometry.height = height),
								(geometry.orientation = orientation),
								(geometry.attributes.position.values && geometry.attributes.position.values.length === 3 * geometry.vertexCount) || (geometry.attributes.position.values = new Float32Array(3 * geometry.vertexCount));
							const o = width / -2,
								r = height / -2,
								segment_width = width / geometry.xSegCount,
								segment_height = height / geometry.ySegCount;
							for (let yIndex = 0; yIndex <= geometry.ySegCount; yIndex++) {
								const t = r + yIndex * segment_height;
								for (let xIndex = 0; xIndex <= geometry.xSegCount; xIndex++) {
									const r = o + xIndex * segment_width,
										l = yIndex * (geometry.xSegCount + 1) + xIndex;
									(geometry.attributes.position.values[3 * l + "xyz".indexOf(orientation[0])] = r), (geometry.attributes.position.values[3 * l + "xyz".indexOf(orientation[1])] = -t);
								}
							}
							geometry.attributes.position.update(),
								_miniGl.debug("Geometry.setSize", {
									position: geometry.attributes.position,
								});
						}
					},
				},
				Mesh: {
					enumerable: false,
					value: class {
						constructor(geometry, material) {
							const mesh = this;
							(mesh.geometry = geometry),
								(mesh.material = material),
								(mesh.wireframe = false),
								(mesh.attributeInstances = []),
								Object.entries(mesh.geometry.attributes).forEach(([e, attribute]) => {
									mesh.attributeInstances.push({
										attribute: attribute,
										location: attribute.attach(e, mesh.material.program),
									});
								}),
								_miniGl.meshes.push(mesh),
								_miniGl.debug("Mesh.constructor", {
									mesh: mesh,
								});
						}
						draw() {
							context.useProgram(this.material.program),
								this.material.uniformInstances.forEach(({ uniform: e, location: t }) => e.update(t)),
								this.attributeInstances.forEach(({ attribute: e, location: t }) => e.use(t)),
								context.drawElements(this.wireframe ? context.LINES : context.TRIANGLES, this.geometry.attributes.index.values.length, context.UNSIGNED_SHORT, 0);
						}
						remove() {
							_miniGl.meshes = _miniGl.meshes.filter((e) => e != this);
						}
					},
				},
				Attribute: {
					enumerable: false,
					value: class {
						constructor(e) {
							(this.type = context.FLOAT), (this.normalized = false), (this.buffer = context.createBuffer()), Object.assign(this, e), this.update();
						}
						update() {
							undefined !== this.values && (context.bindBuffer(this.target, this.buffer), context.bufferData(this.target, this.values, context.STATIC_DRAW));
						}
						attach(e, t) {
							const n = context.getAttribLocation(t, e);
							return this.target === context.ARRAY_BUFFER && (context.enableVertexAttribArray(n), context.vertexAttribPointer(n, this.size, this.type, this.normalized, 0, 0)), n;
						}
						use(e) {
							context.bindBuffer(this.target, this.buffer), this.target === context.ARRAY_BUFFER && (context.enableVertexAttribArray(e), context.vertexAttribPointer(e, this.size, this.type, this.normalized, 0, 0));
						}
					},
				},
			});
		const a = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
		_miniGl.commonUniforms = {
			projectionMatrix: new _miniGl.Uniform({
				type: "mat4",
				value: a,
			}),
			modelViewMatrix: new _miniGl.Uniform({
				type: "mat4",
				value: a,
			}),
			resolution: new _miniGl.Uniform({
				type: "vec2",
				value: [1, 1],
			}),
			aspectRatio: new _miniGl.Uniform({
				type: "float",
				value: 1,
			}),
		};
	}
	setSize(e = 640, t = 480) {
		(this.width = e),
			(this.height = t),
			(this.canvas.width = e),
			(this.canvas.height = t),
			this.gl.viewport(0, 0, e, t),
			(this.commonUniforms.resolution.value = [e, t]),
			(this.commonUniforms.aspectRatio.value = e / t),
			this.debug("MiniGL.setSize", {
				width: e,
				height: t,
			});
	}
	//left, right, top, bottom, near, far
	setOrthographicCamera(e = 0, t = 0, n = 0, i = -2e3, s = 2e3) {
		(this.commonUniforms.projectionMatrix.value = [2 / this.width, 0, 0, 0, 0, 2 / this.height, 0, 0, 0, 0, 2 / (i - s), 0, e, t, n, 1]), this.debug("setOrthographicCamera", this.commonUniforms.projectionMatrix.value);
	}
	render() {
		this.gl.clearColor(0, 0, 0, 0), this.gl.clearDepth(1), this.meshes.forEach((e) => e.draw());
	}
}

//Sets initial properties
function e(object, propertyName, val) {
	return (
		propertyName in object
			? Object.defineProperty(object, propertyName, {
				value: val,
				enumerable: true,
				configurable: true,
				writable: true,
			})
			: (object[propertyName] = val),
		object
	);
}

//Gradient object
class Gradient {
	el = undefined;
	cssVarRetries = 0;
	maxCssVarRetries = 200
	angle = 0
	isLoadedClass = false;
	isScrolling = false;
	scrollingTimeout = undefined;
	scrollingRefreshDelay = 200
	isIntersecting = false;
	shaderFiles = undefined;
	vertexShader = undefined;
	sectionColors = undefined;
	computedCanvasStyle = undefined;
	conf = undefined;
	uniforms = undefined;
	t = 1253106;
	last = 0;
	width = undefined;
	minWidth = 1111;
	height = innerHeight;
	xSegCount = undefined;
	ySegCount = undefined;
	mesh = undefined;
	material = undefined;
	geometry = undefined;
	minigl = undefined;
	scrollObserver = undefined;
	amp = 320;
	seed = 5;
	freqX = 14e-5;
	freqY = 29e-5;
	freqDelta = 1e-5;
	activeColors = [1, 1, 1, 1];
	isMetaKey = false;
	isGradientLegendVisible = false;
	isMouseDown = false;

	additionalVelocity = 0;

	handleScroll = () => {
		clearTimeout(this.scrollingTimeout),
			(this.scrollingTimeout = setTimeout(this.handleScrollEnd, this.scrollingRefreshDelay)),
			this.isGradientLegendVisible && this.hideGradientLegend(),
			this.conf.playing && ((this.isScrolling = true), this.pause());
	};
	handleScrollEnd = () => {
		(this.isScrolling = false), this.isIntersecting && this.play();
	};
	resize = () => {
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.minigl.setSize(this.width, this.height);
		this.minigl.setOrthographicCamera();
		(this.xSegCount = Math.ceil(this.width * this.conf.density[0])),
		(this.ySegCount = Math.ceil(this.height * this.conf.density[1])),
		this.mesh.geometry.setTopology(this.xSegCount, this.ySegCount),
		this.mesh.geometry.setSize(this.width, this.height),
		(this.mesh.material.uniforms.u_shadow_power.value = this.width < innerHeight ? 5 : 6);
	};
	handleMouseDown = (e) => {
		this.isGradientLegendVisible && ((this.isMetaKey = e.metaKey), (this.isMouseDown = true), false === this.conf.playing && requestAnimationFrame(this.animate));
	};
	handleMouseUp = () => {
		this.isMouseDown = false;
	};
	animate = (time) => {
		if (!this.shouldSkipFrame(time) || this.isMouseDown) {
			this.t += Math.min(time - this.last, 1e3 / 15) * (this.additionalVelocity + 1);
			this.last = time;

			if (this.additionalVelocity > 0) {
				this.additionalVelocity *= 0.96;
			}

			if (this.isMouseDown) {
				let e = 160;
				this.isMetaKey && (e = -160), (this.t += e);
			}
			(this.mesh.material.uniforms.u_time.value = this.t), this.minigl.render();
		}
		if (0 !== this.last && this.isStatic) {
			this.minigl.render();
			this.disconnect();

			return;
		}
		/*this.isIntersecting && */ 
		if (this.conf.playing || this.isMouseDown) {
			requestAnimationFrame(this.animate);
		}
	};
	addIsLoadedClass = () => {
		/*this.isIntersecting && */ !this.isLoadedClass &&
			((this.isLoadedClass = true),
			this.el.classList.add("isLoaded"),
			setTimeout(() => {
				this.el.parentElement.classList.add("isLoaded");
			}, 3e3));
	};
	pause = () => {
		this.conf.playing = false;
	};
	play = () => {
		requestAnimationFrame(this.animate), (this.conf.playing = true);
	};
	initGradient = (selector) => {
		this.el = document.querySelector(selector);
		this.connect();
		return this;
	};
	
	async connect() {
		(this.shaderFiles = {
			vertex:
				"varying vec3 v_color;\n\nvoid main() {\n  float time = u_time * u_global.noiseSpeed;\n\n  vec2 noiseCoord = resolution * uvNorm * u_global.noiseFreq;\n\n  vec2 st = 1. - uvNorm.xy;\n\n  //\n  // Tilting the plane\n  //\n\n  // Front-to-back tilt\n  float tilt = resolution.y / 2.0 * uvNorm.y;\n\n  // Left-to-right angle\n  float incline = resolution.x * uvNorm.x / 2.0 * u_vertDeform.incline;\n\n  // Up-down shift to offset incline\n  float offset = resolution.x / 2.0 * u_vertDeform.incline * mix(u_vertDeform.offsetBottom, u_vertDeform.offsetTop, uv.y);\n\n  //\n  // Vertex noise\n  //\n\n  float noise = snoise(vec3(\n    noiseCoord.x * u_vertDeform.noiseFreq.x + time * u_vertDeform.noiseFlow,\n    noiseCoord.y * u_vertDeform.noiseFreq.y,\n    time * u_vertDeform.noiseSpeed + u_vertDeform.noiseSeed\n  )) * u_vertDeform.noiseAmp;\n\n  // Fade noise to zero at edges\n  noise *= 1.0 - pow(abs(uvNorm.y), 2.0);\n\n  // Clamp to 0\n  noise = max(0.0, noise);\n\n  vec3 pos = vec3(\n    position.x,\n    position.y + tilt + incline + noise - offset,\n    position.z\n  );\n\n  //\n  // Vertex color, to be passed to fragment shader\n  //\n\n  if (u_active_colors[0] == 1.) {\n    v_color = u_baseColor;\n  }\n\n  for (int i = 0; i < u_waveLayers_length; i++) {\n    if (u_active_colors[i + 1] == 1.) {\n      WaveLayers layer = u_waveLayers[i];\n\n      float noise = smoothstep(\n        layer.noiseFloor,\n        layer.noiseCeil,\n        snoise(vec3(\n          noiseCoord.x * layer.noiseFreq.x + time * layer.noiseFlow,\n          noiseCoord.y * layer.noiseFreq.y,\n          time * layer.noiseSpeed + layer.noiseSeed\n        )) / 2.0 + 0.5\n      );\n\n      v_color = blendNormal(v_color, layer.color, pow(noise, 4.));\n    }\n  }\n\n  //\n  // Finish\n  //\n\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);\n}",
			noise:
				"//\n// Description : Array and textureless GLSL 2D/3D/4D simplex\n//               noise functions.\n//      Author : Ian McEwan, Ashima Arts.\n//  Maintainer : stegu\n//     Lastmod : 20110822 (ijm)\n//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.\n//               Distributed under the MIT License. See LICENSE file.\n//               https://github.com/ashima/webgl-noise\n//               https://github.com/stegu/webgl-noise\n//\n\nvec3 mod289(vec3 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 mod289(vec4 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 permute(vec4 x) {\n    return mod289(((x*34.0)+1.0)*x);\n}\n\nvec4 taylorInvSqrt(vec4 r)\n{\n  return 1.79284291400159 - 0.85373472095314 * r;\n}\n\nfloat snoise(vec3 v)\n{\n  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;\n  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);\n\n// First corner\n  vec3 i  = floor(v + dot(v, C.yyy) );\n  vec3 x0 =   v - i + dot(i, C.xxx) ;\n\n// Other corners\n  vec3 g = step(x0.yzx, x0.xyz);\n  vec3 l = 1.0 - g;\n  vec3 i1 = min( g.xyz, l.zxy );\n  vec3 i2 = max( g.xyz, l.zxy );\n\n  //   x0 = x0 - 0.0 + 0.0 * C.xxx;\n  //   x1 = x0 - i1  + 1.0 * C.xxx;\n  //   x2 = x0 - i2  + 2.0 * C.xxx;\n  //   x3 = x0 - 1.0 + 3.0 * C.xxx;\n  vec3 x1 = x0 - i1 + C.xxx;\n  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y\n  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y\n\n// Permutations\n  i = mod289(i);\n  vec4 p = permute( permute( permute(\n            i.z + vec4(0.0, i1.z, i2.z, 1.0 ))\n          + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))\n          + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));\n\n// Gradients: 7x7 points over a square, mapped onto an octahedron.\n// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)\n  float n_ = 0.142857142857; // 1.0/7.0\n  vec3  ns = n_ * D.wyz - D.xzx;\n\n  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)\n\n  vec4 x_ = floor(j * ns.z);\n  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)\n\n  vec4 x = x_ *ns.x + ns.yyyy;\n  vec4 y = y_ *ns.x + ns.yyyy;\n  vec4 h = 1.0 - abs(x) - abs(y);\n\n  vec4 b0 = vec4( x.xy, y.xy );\n  vec4 b1 = vec4( x.zw, y.zw );\n\n  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;\n  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;\n  vec4 s0 = floor(b0)*2.0 + 1.0;\n  vec4 s1 = floor(b1)*2.0 + 1.0;\n  vec4 sh = -step(h, vec4(0.0));\n\n  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;\n  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;\n\n  vec3 p0 = vec3(a0.xy,h.x);\n  vec3 p1 = vec3(a0.zw,h.y);\n  vec3 p2 = vec3(a1.xy,h.z);\n  vec3 p3 = vec3(a1.zw,h.w);\n\n//Normalise gradients\n  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));\n  p0 *= norm.x;\n  p1 *= norm.y;\n  p2 *= norm.z;\n  p3 *= norm.w;\n\n// Mix final noise value\n  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);\n  m = m * m;\n  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),\n                                dot(p2,x2), dot(p3,x3) ) );\n}",
			blend:
				"//\n// https://github.com/jamieowen/glsl-blend\n//\n\n// Normal\n\nvec3 blendNormal(vec3 base, vec3 blend) {\n\treturn blend;\n}\n\nvec3 blendNormal(vec3 base, vec3 blend, float opacity) {\n\treturn (blendNormal(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// Screen\n\nfloat blendScreen(float base, float blend) {\n\treturn 1.0-((1.0-base)*(1.0-blend));\n}\n\nvec3 blendScreen(vec3 base, vec3 blend) {\n\treturn vec3(blendScreen(base.r,blend.r),blendScreen(base.g,blend.g),blendScreen(base.b,blend.b));\n}\n\nvec3 blendScreen(vec3 base, vec3 blend, float opacity) {\n\treturn (blendScreen(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// Multiply\n\nvec3 blendMultiply(vec3 base, vec3 blend) {\n\treturn base*blend;\n}\n\nvec3 blendMultiply(vec3 base, vec3 blend, float opacity) {\n\treturn (blendMultiply(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// Overlay\n\nfloat blendOverlay(float base, float blend) {\n\treturn base<0.5?(2.0*base*blend):(1.0-2.0*(1.0-base)*(1.0-blend));\n}\n\nvec3 blendOverlay(vec3 base, vec3 blend) {\n\treturn vec3(blendOverlay(base.r,blend.r),blendOverlay(base.g,blend.g),blendOverlay(base.b,blend.b));\n}\n\nvec3 blendOverlay(vec3 base, vec3 blend, float opacity) {\n\treturn (blendOverlay(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// Hard light\n\nvec3 blendHardLight(vec3 base, vec3 blend) {\n\treturn blendOverlay(blend,base);\n}\n\nvec3 blendHardLight(vec3 base, vec3 blend, float opacity) {\n\treturn (blendHardLight(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// Soft light\n\nfloat blendSoftLight(float base, float blend) {\n\treturn (blend<0.5)?(2.0*base*blend+base*base*(1.0-2.0*blend)):(sqrt(base)*(2.0*blend-1.0)+2.0*base*(1.0-blend));\n}\n\nvec3 blendSoftLight(vec3 base, vec3 blend) {\n\treturn vec3(blendSoftLight(base.r,blend.r),blendSoftLight(base.g,blend.g),blendSoftLight(base.b,blend.b));\n}\n\nvec3 blendSoftLight(vec3 base, vec3 blend, float opacity) {\n\treturn (blendSoftLight(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// Color dodge\n\nfloat blendColorDodge(float base, float blend) {\n\treturn (blend==1.0)?blend:min(base/(1.0-blend),1.0);\n}\n\nvec3 blendColorDodge(vec3 base, vec3 blend) {\n\treturn vec3(blendColorDodge(base.r,blend.r),blendColorDodge(base.g,blend.g),blendColorDodge(base.b,blend.b));\n}\n\nvec3 blendColorDodge(vec3 base, vec3 blend, float opacity) {\n\treturn (blendColorDodge(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// Color burn\n\nfloat blendColorBurn(float base, float blend) {\n\treturn (blend==0.0)?blend:max((1.0-((1.0-base)/blend)),0.0);\n}\n\nvec3 blendColorBurn(vec3 base, vec3 blend) {\n\treturn vec3(blendColorBurn(base.r,blend.r),blendColorBurn(base.g,blend.g),blendColorBurn(base.b,blend.b));\n}\n\nvec3 blendColorBurn(vec3 base, vec3 blend, float opacity) {\n\treturn (blendColorBurn(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// Vivid Light\n\nfloat blendVividLight(float base, float blend) {\n\treturn (blend<0.5)?blendColorBurn(base,(2.0*blend)):blendColorDodge(base,(2.0*(blend-0.5)));\n}\n\nvec3 blendVividLight(vec3 base, vec3 blend) {\n\treturn vec3(blendVividLight(base.r,blend.r),blendVividLight(base.g,blend.g),blendVividLight(base.b,blend.b));\n}\n\nvec3 blendVividLight(vec3 base, vec3 blend, float opacity) {\n\treturn (blendVividLight(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// Lighten\n\nfloat blendLighten(float base, float blend) {\n\treturn max(blend,base);\n}\n\nvec3 blendLighten(vec3 base, vec3 blend) {\n\treturn vec3(blendLighten(base.r,blend.r),blendLighten(base.g,blend.g),blendLighten(base.b,blend.b));\n}\n\nvec3 blendLighten(vec3 base, vec3 blend, float opacity) {\n\treturn (blendLighten(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// Linear burn\n\nfloat blendLinearBurn(float base, float blend) {\n\t// Note : Same implementation as BlendSubtractf\n\treturn max(base+blend-1.0,0.0);\n}\n\nvec3 blendLinearBurn(vec3 base, vec3 blend) {\n\t// Note : Same implementation as BlendSubtract\n\treturn max(base+blend-vec3(1.0),vec3(0.0));\n}\n\nvec3 blendLinearBurn(vec3 base, vec3 blend, float opacity) {\n\treturn (blendLinearBurn(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// Linear dodge\n\nfloat blendLinearDodge(float base, float blend) {\n\t// Note : Same implementation as BlendAddf\n\treturn min(base+blend,1.0);\n}\n\nvec3 blendLinearDodge(vec3 base, vec3 blend) {\n\t// Note : Same implementation as BlendAdd\n\treturn min(base+blend,vec3(1.0));\n}\n\nvec3 blendLinearDodge(vec3 base, vec3 blend, float opacity) {\n\treturn (blendLinearDodge(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// Linear light\n\nfloat blendLinearLight(float base, float blend) {\n\treturn blend<0.5?blendLinearBurn(base,(2.0*blend)):blendLinearDodge(base,(2.0*(blend-0.5)));\n}\n\nvec3 blendLinearLight(vec3 base, vec3 blend) {\n\treturn vec3(blendLinearLight(base.r,blend.r),blendLinearLight(base.g,blend.g),blendLinearLight(base.b,blend.b));\n}\n\nvec3 blendLinearLight(vec3 base, vec3 blend, float opacity) {\n\treturn (blendLinearLight(base, blend) * opacity + base * (1.0 - opacity));\n}",
			fragment:
				"varying vec3 v_color;\n\nvoid main() {\n  vec3 color = v_color;\n  if (u_darken_top == 1.0) {\n    vec2 st = gl_FragCoord.xy/resolution.xy;\n    color.g -= pow(st.y + sin(-12.0) * st.x, u_shadow_power) * 0.4;\n  }\n  gl_FragColor = vec4(color, 1.0);\n}",
		}),
			(this.conf = {
				presetName: "",
				wireframe: false,
				density: [0.06, 0.16],
				zoom: 1,
				rotation: 0,
				playing: true,
			}),
			document.querySelectorAll("canvas").length < 1
				? console.log("DID NOT LOAD HERO STRIPE CANVAS")
				: ((this.minigl = new MiniGl(this.el, null, null, true)),
				requestAnimationFrame(() => {
					this.el && ((this.computedCanvasStyle = getComputedStyle(this.el)), this.waitForCssVars());
				}));
				/*
			this.scrollObserver = await s.create(.1, false),
			this.scrollObserver.observe(this.el),
			this.scrollObserver.onSeparate(() => {
				window.removeEventListener("scroll", this.handleScroll), window.removeEventListener("mousedown", this.handleMouseDown), window.removeEventListener("mouseup", this.handleMouseUp), window.removeEventListener("keydown", this.handleKeyDown), this.isIntersecting = false, this.conf.playing && this.pause()
			}), 
			this.scrollObserver.onIntersect(() => {
				window.addEventListener("scroll", this.handleScroll), window.addEventListener("mousedown", this.handleMouseDown), window.addEventListener("mouseup", this.handleMouseUp), window.addEventListener("keydown", this.handleKeyDown), this.isIntersecting = true, this.addIsLoadedClass(), this.play()
			})*/
	}
	disconnect() {
		this.scrollObserver &&
			(window.removeEventListener("scroll", this.handleScroll),
			window.removeEventListener("mousedown", this.handleMouseDown),
			window.removeEventListener("mouseup", this.handleMouseUp),
			window.removeEventListener("keydown", this.handleKeyDown),
			this.scrollObserver.disconnect()),
			window.removeEventListener("resize", this.resize);
	}
	initMaterial() {
		this.uniforms = {
			u_time: new this.minigl.Uniform({
				value: 0,
			}),
			u_shadow_power: new this.minigl.Uniform({
				value: 5,
			}),
			u_darken_top: new this.minigl.Uniform({
				value: "" === this.el.dataset.jsDarkenTop ? 1 : 0,
			}),
			u_active_colors: new this.minigl.Uniform({
				value: this.activeColors,
				type: "vec4",
			}),
			u_global: new this.minigl.Uniform({
				value: {
					noiseFreq: new this.minigl.Uniform({
						value: [this.freqX, this.freqY],
						type: "vec2",
					}),
					noiseSpeed: new this.minigl.Uniform({
						value: 5e-6,
					}),
				},
				type: "struct",
			}),
			u_vertDeform: new this.minigl.Uniform({
				value: {
					incline: new this.minigl.Uniform({
						value: Math.sin(this.angle) / Math.cos(this.angle),
					}),
					offsetTop: new this.minigl.Uniform({
						value: -0.5,
					}),
					offsetBottom: new this.minigl.Uniform({
						value: -0.5,
					}),
					noiseFreq: new this.minigl.Uniform({
						value: [3, 4],
						type: "vec2",
					}),
					noiseAmp: new this.minigl.Uniform({
						value: this.amp,
					}),
					noiseSpeed: new this.minigl.Uniform({
						value: 10,
					}),
					noiseFlow: new this.minigl.Uniform({
						value: 3,
					}),
					noiseSeed: new this.minigl.Uniform({
						value: this.seed,
					}),
				},
				type: "struct",
				excludeFrom: "fragment",
			}),
			u_baseColor: new this.minigl.Uniform({
				value: this.sectionColors[0],
				type: "vec3",
				excludeFrom: "fragment",
			}),
			u_waveLayers: new this.minigl.Uniform({
				value: [],
				excludeFrom: "fragment",
				type: "array",
			}),
		};
		for (let e = 1; e < this.sectionColors.length; e += 1)
			this.uniforms.u_waveLayers.value.push(
				new this.minigl.Uniform({
					value: {
						color: new this.minigl.Uniform({
							value: this.sectionColors[e],
							type: "vec3",
						}),
						noiseFreq: new this.minigl.Uniform({
							value: [2 + e / this.sectionColors.length, 3 + e / this.sectionColors.length],
							type: "vec2",
						}),
						noiseSpeed: new this.minigl.Uniform({
							value: 11 + 0.3 * e,
						}),
						noiseFlow: new this.minigl.Uniform({
							value: 6.5 + 0.3 * e,
						}),
						noiseSeed: new this.minigl.Uniform({
							value: this.seed + 10 * e,
						}),
						noiseFloor: new this.minigl.Uniform({
							value: 0.1,
						}),
						noiseCeil: new this.minigl.Uniform({
							value: 0.63 + 0.07 * e,
						}),
					},
					type: "struct",
				})
			);
		return (this.vertexShader = [this.shaderFiles.noise, this.shaderFiles.blend, this.shaderFiles.vertex].join("\n\n")), new this.minigl.Material(this.vertexShader, this.shaderFiles.fragment, this.uniforms);
	}
	initMesh() {
		(this.material = this.initMaterial()), (this.geometry = new this.minigl.PlaneGeometry()), (this.mesh = new this.minigl.Mesh(this.geometry, this.material));
	}
	shouldSkipFrame(e) {
		return !!window.document.hidden 
			|| !this.conf.playing 
			// || parseInt(e, 10) % 2 == 0 
			|| undefined;
	}
	updateFrequency(e) {
		(this.freqX += e), (this.freqY += e);
	}
	toggleColor(index) {
		this.activeColors[index] = 0 === this.activeColors[index] ? 1 : 0;
	}
	showGradientLegend() {
		this.width > this.minWidth && ((this.isGradientLegendVisible = true), document.body.classList.add("isGradientLegendVisible"));
	}
	hideGradientLegend() {
		(this.isGradientLegendVisible = false), document.body.classList.remove("isGradientLegendVisible");
	}
	init() {
		this.initGradientColors(), this.initMesh(), this.resize(), requestAnimationFrame(this.animate), window.addEventListener("resize", this.resize);
	}
	/*
	* Waiting for the css variables to become available, usually on page load before we can continue.
	* Using default colors assigned below if no variables have been found after maxCssVarRetries
	*/
	waitForCssVars() {
		if (this.computedCanvasStyle && -1 !== this.computedCanvasStyle.getPropertyValue("--gradient-color-1").indexOf("#")) this.init(), this.addIsLoadedClass();
		else {
			if (((this.cssVarRetries += 1), this.cssVarRetries > this.maxCssVarRetries)) {
				return (this.sectionColors = [16711680, 16711680, 16711935, 65280, 255]), void this.init();
			}
			requestAnimationFrame(() => this.waitForCssVars());
		}
	}
	/*
	* Initializes the four section colors by retrieving them from css variables.
	*/
	initGradientColors() {
		this.sectionColors = ["--gradient-color-1", "--gradient-color-2", "--gradient-color-3", "--gradient-color-4"]
			.map((cssPropertyName) => {
				let hex = this.computedCanvasStyle.getPropertyValue(cssPropertyName).trim();
				//Check if shorthand hex value was used and double the length so the conversion in normalizeColor will work.
				if (4 === hex.length) {
					const hexTemp = hex
						.substr(1)
						.split("")
						.map((hexTemp) => hexTemp + hexTemp)
						.join("");
					hex = `#${hexTemp}`;
				}
				return hex && `0x${hex.substr(1)}`;
			})
			.filter(Boolean)
			.map(normalizeColor);
	}
}

/*
*Finally initializing the Gradient class, assigning a canvas to it and calling Gradient.connect() which initializes everything,
* Use Gradient.pause() and Gradient.play() for controls.
*
* Here are some default property values you can change anytime:
* Amplitude:    Gradient.amp = 0
* Colors:       Gradient.sectionColors (if you change colors, use normalizeColor(#hexValue)) before you assign it.
*
*
* Useful functions
* Gradient.toggleColor(index)
* Gradient.updateFrequency(freq)
*/
// var gradient = new Gradient();
// 	gradient.initGradient("#gradient-canvas");

var undefined$d = undefined;

/* src\ui\components\Gradient2.svelte generated by Svelte v3.38.2 */
const file$d = "src\\ui\\components\\Gradient2.svelte";

function create_fragment$d(ctx) {
	let component;
	let canvas;
	let component_intro;
	let component_outro;
	let current;

	const block = {
		c: function create() {
			component = element("component");
			canvas = element("canvas");
			add_location(canvas, file$d, 76, 1, 2843);
			set_style(component, "--height", CSSUtility.parse(/*$heightW*/ ctx[5]));
			set_style(component, "--width", CSSUtility.parse(/*$widthW*/ ctx[6]));
			set_style(component, "--gradient-color-1", /*gradientColours*/ ctx[2][0]);
			set_style(component, "--gradient-color-2", /*gradientColours*/ ctx[2][1]);
			set_style(component, "--gradient-color-3", /*gradientColours*/ ctx[2][2]);
			set_style(component, "--gradient-color-4", /*gradientColours*/ ctx[2][3]);
			attr_dev(component, "class", "svelte-bdgnxz");
			add_location(component, file$d, 63, 0, 2448);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, component, anchor);
			append_dev(component, canvas);
			/*canvas_binding*/ ctx[9](canvas);
			/*component_binding*/ ctx[10](component);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (!current || dirty & /*$heightW*/ 32) {
				set_style(component, "--height", CSSUtility.parse(/*$heightW*/ ctx[5]));
			}

			if (!current || dirty & /*$widthW*/ 64) {
				set_style(component, "--width", CSSUtility.parse(/*$widthW*/ ctx[6]));
			}

			if (!current || dirty & /*gradientColours*/ 4) {
				set_style(component, "--gradient-color-1", /*gradientColours*/ ctx[2][0]);
			}

			if (!current || dirty & /*gradientColours*/ 4) {
				set_style(component, "--gradient-color-2", /*gradientColours*/ ctx[2][1]);
			}

			if (!current || dirty & /*gradientColours*/ 4) {
				set_style(component, "--gradient-color-3", /*gradientColours*/ ctx[2][2]);
			}

			if (!current || dirty & /*gradientColours*/ 4) {
				set_style(component, "--gradient-color-4", /*gradientColours*/ ctx[2][3]);
			}
		},
		i: function intro(local) {
			if (current) return;

			add_render_callback(() => {
				if (component_outro) component_outro.end(1);
				if (!component_intro) component_intro = create_in_transition(component, fadeIn, { duration: 1000 });
				component_intro.start();
			});

			current = true;
		},
		o: function outro(local) {
			if (component_intro) component_intro.invalidate();
			component_outro = create_out_transition(component, fadeOut, { duration: 100 });
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(component);
			/*canvas_binding*/ ctx[9](null);
			/*component_binding*/ ctx[10](null);
			if (detaching && component_outro) component_outro.end();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$d.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$d($$self, $$props, $$invalidate) {
	let $heightW,
		$$unsubscribe_heightW = noop$1,
		$$subscribe_heightW = () => ($$unsubscribe_heightW(), $$unsubscribe_heightW = subscribe(heightW, $$value => $$invalidate(5, $heightW = $$value)), heightW);

	let $widthW,
		$$unsubscribe_widthW = noop$1,
		$$subscribe_widthW = () => ($$unsubscribe_widthW(), $$unsubscribe_widthW = subscribe(widthW, $$value => $$invalidate(6, $widthW = $$value)), widthW);

	$$self.$$.on_destroy.push(() => $$unsubscribe_heightW());
	$$self.$$.on_destroy.push(() => $$unsubscribe_widthW());
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("Gradient2", slots, []);
	
	let { height = "100vh" } = $$props;
	let { heightW = writable(height) } = $$props;
	validate_store(heightW, "heightW");
	$$subscribe_heightW();
	let { width = "100%" } = $$props;
	let { widthW = writable(width) } = $$props;
	validate_store(widthW, "widthW");
	$$subscribe_widthW();

	let { gradientColours = [
		CSSUtility.getVariable("--colour-background-secondary"),
		CSSUtility.getVariable("--colour-accent-primary"),
		CSSUtility.getVariable("--colour-background-primary"),
		CSSUtility.getVariable("--colour-background-secondary")
	] } = $$props;

	// export let gradientColours: [string, string, string, string] = [
	// 	'#7af092',
	// 	'#16f7bb',
	// 	'#db7f8e',
	// 	'#9882ac',
	// ];
	const gradient = new Gradient();

	let componentDomContent;
	let canvasDomContent;

	onMount(() => {
		window.addEventListener("mousemove", onMouseMove);
		window.addEventListener("touchmove", onMouseMove);
		gradient.el = canvasDomContent;
		gradient.connect();
		gradient.updateFrequency(-0.00005);
	}); // gradient.amp = 1000;

	onDestroy(() => {
		window.removeEventListener("mousemove", onMouseMove);
		window.removeEventListener("touchmove", onMouseMove);
		gradient.disconnect();
	});

	let lastMousePositionX = 0;
	let lastMousePositionY = 0;
	let lastMouseMoveTime = 0;

	function onMouseMove(event) {
		var _a, _b, _c, _d;

		const currentMousePositionX = ((_b = (_a = event.touches) === null || _a === void 0
		? void 0
		: _a[0].screenX) !== null && _b !== void 0
		? _b
		: event.screenX) * devicePixelRatio;

		const currentMousePositionY = ((_d = (_c = event.touches) === null || _c === void 0
		? void 0
		: _c[0].screenY) !== null && _d !== void 0
		? _d
		: event.screenY) * devicePixelRatio;

		const currentMouseMoveTime = performance.now();
		const mouseVelocity = (Math.abs(currentMousePositionX - lastMousePositionX) + Math.abs(currentMousePositionY - lastMousePositionY)) / Math.abs(currentMouseMoveTime - lastMouseMoveTime);
		lastMousePositionX = currentMousePositionX;
		lastMousePositionY = currentMousePositionY;
		lastMouseMoveTime = currentMouseMoveTime;
		gradient.additionalVelocity = Math.min(gradient.additionalVelocity + mouseVelocity / 5, 50);
	}

	const writable_props = ["height", "heightW", "width", "widthW", "gradientColours"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Gradient2> was created with unknown prop '${key}'`);
	});

	function canvas_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			canvasDomContent = $$value;
			$$invalidate(4, canvasDomContent);
		});
	}

	function component_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			componentDomContent = $$value;
			$$invalidate(3, componentDomContent);
		});
	}

	$$self.$$set = $$props => {
		if ("height" in $$props) $$invalidate(7, height = $$props.height);
		if ("heightW" in $$props) $$subscribe_heightW($$invalidate(0, heightW = $$props.heightW));
		if ("width" in $$props) $$invalidate(8, width = $$props.width);
		if ("widthW" in $$props) $$subscribe_widthW($$invalidate(1, widthW = $$props.widthW));
		if ("gradientColours" in $$props) $$invalidate(2, gradientColours = $$props.gradientColours);
	};

	$$self.$capture_state = () => ({
		onDestroy,
		onMount,
		writable,
		CSSUtility,
		fadeIn,
		fadeOut,
		Gradient,
		height,
		heightW,
		width,
		widthW,
		gradientColours,
		gradient,
		componentDomContent,
		canvasDomContent,
		lastMousePositionX,
		lastMousePositionY,
		lastMouseMoveTime,
		onMouseMove,
		$heightW,
		$widthW
	});

	$$self.$inject_state = $$props => {
		if ("height" in $$props) $$invalidate(7, height = $$props.height);
		if ("heightW" in $$props) $$subscribe_heightW($$invalidate(0, heightW = $$props.heightW));
		if ("width" in $$props) $$invalidate(8, width = $$props.width);
		if ("widthW" in $$props) $$subscribe_widthW($$invalidate(1, widthW = $$props.widthW));
		if ("gradientColours" in $$props) $$invalidate(2, gradientColours = $$props.gradientColours);
		if ("componentDomContent" in $$props) $$invalidate(3, componentDomContent = $$props.componentDomContent);
		if ("canvasDomContent" in $$props) $$invalidate(4, canvasDomContent = $$props.canvasDomContent);
		if ("lastMousePositionX" in $$props) lastMousePositionX = $$props.lastMousePositionX;
		if ("lastMousePositionY" in $$props) lastMousePositionY = $$props.lastMousePositionY;
		if ("lastMouseMoveTime" in $$props) lastMouseMoveTime = $$props.lastMouseMoveTime;
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		heightW,
		widthW,
		gradientColours,
		componentDomContent,
		canvasDomContent,
		$heightW,
		$widthW,
		height,
		width,
		canvas_binding,
		component_binding
	];
}

class Gradient2 extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$d, create_fragment$d, safe_not_equal, {
			height: 7,
			heightW: 0,
			width: 8,
			widthW: 1,
			gradientColours: 2
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Gradient2",
			options,
			id: create_fragment$d.name
		});
	}

	get height() {
		return this.$$.ctx[7];
	}

	set height(height) {
		this.$set({ height });
		flush();
	}

	get heightW() {
		return this.$$.ctx[0];
	}

	set heightW(heightW) {
		this.$set({ heightW });
		flush();
	}

	get width() {
		return this.$$.ctx[8];
	}

	set width(width) {
		this.$set({ width });
		flush();
	}

	get widthW() {
		return this.$$.ctx[1];
	}

	set widthW(widthW) {
		this.$set({ widthW });
		flush();
	}

	get gradientColours() {
		return this.$$.ctx[2];
	}

	set gradientColours(gradientColours) {
		this.$set({ gradientColours });
		flush();
	}
}

var undefined$c = undefined;

/* src\ui\blocks\Toast.svelte generated by Svelte v3.38.2 */
const file$c = "src\\ui\\blocks\\Toast.svelte";

function get_each_context$1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[7] = list[i];
	return child_ctx;
}

// (51:3) <Hint      level={toast.level}      overrideColour='--colour-background-primary'     >
function create_default_slot$6(ctx) {
	let t_value = /*toast*/ ctx[7].text + "";
	let t;

	const block = {
		c: function create() {
			t = text(t_value);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*$toastsW*/ 2 && t_value !== (t_value = /*toast*/ ctx[7].text + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot$6.name,
		type: "slot",
		source: "(51:3) <Hint      level={toast.level}      overrideColour='--colour-background-primary'     >",
		ctx
	});

	return block;
}

// (43:1) {#each $toastsW as toast}
function create_each_block$1(ctx) {
	let container;
	let hint;
	let t0;
	let button;
	let t1;
	let container_intro;
	let container_outro;
	let current;

	hint = new Hint({
			props: {
				level: /*toast*/ ctx[7].level,
				overrideColour: "--colour-background-primary",
				$$slots: { default: [create_default_slot$6] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	function click_handler() {
		return /*click_handler*/ ctx[4](/*toast*/ ctx[7]);
	}

	button = new Button({
			props: {
				icon: "clear",
				backgroundColour: "transparent",
				textColour: "--colour-background-primary",
				hoverColour: "#fff2",
				padding: "4px 8px",
				height: 32
			},
			$$inline: true
		});

	button.$on("click", click_handler);

	const block = {
		c: function create() {
			container = element("container");
			create_component(hint.$$.fragment);
			t0 = space();
			create_component(button.$$.fragment);
			t1 = space();
			set_style(container, "--colour-toast", CSSUtility.parse(LevelColours[/*toast*/ ctx[7].level]) + "\r\n\t\t\t");
			attr_dev(container, "class", "svelte-i7al2h");
			add_location(container, file$c, 43, 2, 1286);
		},
		m: function mount(target, anchor) {
			insert_dev(target, container, anchor);
			mount_component(hint, container, null);
			append_dev(container, t0);
			mount_component(button, container, null);
			append_dev(container, t1);
			current = true;
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
			const hint_changes = {};
			if (dirty & /*$toastsW*/ 2) hint_changes.level = /*toast*/ ctx[7].level;

			if (dirty & /*$$scope, $toastsW*/ 1026) {
				hint_changes.$$scope = { dirty, ctx };
			}

			hint.$set(hint_changes);

			if (!current || dirty & /*$toastsW*/ 2) {
				set_style(container, "--colour-toast", CSSUtility.parse(LevelColours[/*toast*/ ctx[7].level]) + "\r\n\t\t\t");
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(hint.$$.fragment, local);
			transition_in(button.$$.fragment, local);

			add_render_callback(() => {
				if (container_outro) container_outro.end(1);
				if (!container_intro) container_intro = create_in_transition(container, dropIn, {});
				container_intro.start();
			});

			current = true;
		},
		o: function outro(local) {
			transition_out(hint.$$.fragment, local);
			transition_out(button.$$.fragment, local);
			if (container_intro) container_intro.invalidate();
			container_outro = create_out_transition(container, dropOut, {});
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(container);
			destroy_component(hint);
			destroy_component(button);
			if (detaching && container_outro) container_outro.end();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$1.name,
		type: "each",
		source: "(43:1) {#each $toastsW as toast}",
		ctx
	});

	return block;
}

function create_fragment$c(ctx) {
	let component;
	let current;
	let each_value = /*$toastsW*/ ctx[1];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	const block = {
		c: function create() {
			component = element("component");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(component, "class", "svelte-i7al2h");
			add_location(component, file$c, 41, 0, 1243);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, component, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(component, null);
			}

			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*CSSUtility, LevelColours, $toastsW, dismiss*/ 6) {
				each_value = /*$toastsW*/ ctx[1];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$1(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block$1(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(component, null);
					}
				}

				group_outros();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o: function outro(local) {
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(component);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$c.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

class ToastItem extends Item {
	constructor() {
		super(...arguments);
		this.uid = String(Date.now());
		this.text = "";
		this.level = Levels.INFO;
		this.duration = 2000;
	}
}

function instance$c($$self, $$props, $$invalidate) {
	let $toastsW,
		$$unsubscribe_toastsW = noop$1,
		$$subscribe_toastsW = () => ($$unsubscribe_toastsW(), $$unsubscribe_toastsW = subscribe(toastsW, $$value => $$invalidate(1, $toastsW = $$value)), toastsW);

	$$self.$$.on_destroy.push(() => $$unsubscribe_toastsW());
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("Toast", slots, []);
	let { toasts = [] } = $$props;
	let { toastsW = writable(toasts) } = $$props;
	validate_store(toastsW, "toastsW");
	$$subscribe_toastsW();
	const scheduledUIDs = [];

	if ($toastsW == null) {
		set_store_value(toastsW, $toastsW = [], $toastsW);
	}

	function dismiss(uid) {
		$toastsW.splice($toastsW.findIndex(toast => toast.uid === uid), 1);
		toastsW.set($toastsW);
	}

	function scheduleDismiss(uid, duration) {
		if (scheduledUIDs.includes(uid)) {
			return;
		}

		setTimeout(() => dismiss(uid), duration);
		scheduledUIDs.push(uid);
	}

	const writable_props = ["toasts", "toastsW"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Toast> was created with unknown prop '${key}'`);
	});

	const click_handler = toast => dismiss(toast.uid);

	$$self.$$set = $$props => {
		if ("toasts" in $$props) $$invalidate(3, toasts = $$props.toasts);
		if ("toastsW" in $$props) $$subscribe_toastsW($$invalidate(0, toastsW = $$props.toastsW));
	};

	$$self.$capture_state = () => ({
		Item,
		Levels,
		ToastItem,
		writable,
		CSSUtility,
		Hint,
		LevelColours,
		dropIn,
		dropOut,
		Button,
		toasts,
		toastsW,
		scheduledUIDs,
		dismiss,
		scheduleDismiss,
		$toastsW
	});

	$$self.$inject_state = $$props => {
		if ("toasts" in $$props) $$invalidate(3, toasts = $$props.toasts);
		if ("toastsW" in $$props) $$subscribe_toastsW($$invalidate(0, toastsW = $$props.toastsW));
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*$toastsW*/ 2) {
			$: $toastsW.forEach(toast => scheduleDismiss(toast.uid, toast.duration));
		}
	};

	return [toastsW, $toastsW, dismiss, toasts, click_handler];
}

class Toast extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$c, create_fragment$c, safe_not_equal, { toasts: 3, toastsW: 0 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Toast",
			options,
			id: create_fragment$c.name
		});
	}

	get toasts() {
		return this.$$.ctx[3];
	}

	set toasts(toasts) {
		this.$set({ toasts });
		flush();
	}

	get toastsW() {
		return this.$$.ctx[0];
	}

	set toastsW(toastsW) {
		this.$set({ toastsW });
		flush();
	}
}

var undefined$b = undefined;

/* src\ui\routes\LandingRoute.svelte generated by Svelte v3.38.2 */
const file$b = "src\\ui\\routes\\LandingRoute.svelte";

// (52:1) {#key $gradientRemountIndexW}
function create_key_block$1(ctx) {
	let container;
	let gradient2;
	let current;
	gradient2 = new Gradient2({ $$inline: true });

	const block = {
		c: function create() {
			container = element("container");
			create_component(gradient2.$$.fragment);
			attr_dev(container, "class", "gradient svelte-d23m9n");
			attr_dev(container, "_", /*$gradientRemountIndexW*/ ctx[2]);
			add_location(container, file$b, 52, 2, 1583);
		},
		m: function mount(target, anchor) {
			insert_dev(target, container, anchor);
			mount_component(gradient2, container, null);
			current = true;
		},
		p: function update(ctx, dirty) {
			if (!current || dirty & /*$gradientRemountIndexW*/ 4) {
				attr_dev(container, "_", /*$gradientRemountIndexW*/ ctx[2]);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(gradient2.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(gradient2.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(container);
			destroy_component(gradient2);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_key_block$1.name,
		type: "key",
		source: "(52:1) {#key $gradientRemountIndexW}",
		ctx
	});

	return block;
}

// (93:4) <Button       backgroundColour='--colour-text-primary'       hoverColour='--colour-text-secondary'       textColour='--colour-background-primary'       icon='settings'       on:click={() => customizeDialogIsActiveW.set(true)}      >
function create_default_slot_2(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("customize");
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_2.name,
		type: "slot",
		source: "(93:4) <Button       backgroundColour='--colour-text-primary'       hoverColour='--colour-text-secondary'       textColour='--colour-background-primary'       icon='settings'       on:click={() => customizeDialogIsActiveW.set(true)}      >",
		ctx
	});

	return block;
}

// (106:4) <Button       icon='nat'       on:click={onSubmit}      >
function create_default_slot_1(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("render it");
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_1.name,
		type: "slot",
		source: "(106:4) <Button       icon='nat'       on:click={onSubmit}      >",
		ctx
	});

	return block;
}

// (43:0) <Fragment   isPadded={true}   isInAnimated={true}   isOutAnimated={true}   height='100vh'   width='100%'   align='flex-end'   justify='center'  >
function create_default_slot$5(ctx) {
	let previous_key = /*$gradientRemountIndexW*/ ctx[2];
	let t0;
	let container5;
	let container1;
	let container0;
	let input_1;
	let updating_value;
	let t1;
	let container4;
	let container2;
	let button0;
	let t2;
	let container3;
	let button1;
	let t3;
	let dialog;
	let current;
	let key_block = create_key_block$1(ctx);

	function input_1_value_binding(value) {
		/*input_1_value_binding*/ ctx[4](value);
	}

	let input_1_props = {
		backgroundColour: "transparent",
		activeBackgroundColour: "transparent",
		depth: 0,
		fontFamily: "--font-family-1",
		fontSize: "--font-size-big",
		isMovingLabel: false,
		labelTop: "--font-size-big",
		height: "min(30vw, 20rem)",
		labelFontSize: "--font-size-big",
		indent: 0,
		label: "name…",
		buttonComponent: null
	};

	if (/*name*/ ctx[0] !== void 0) {
		input_1_props.value = /*name*/ ctx[0];
	}

	input_1 = new Input({ props: input_1_props, $$inline: true });
	binding_callbacks.push(() => bind(input_1, "value", input_1_value_binding));
	/*input_1_binding*/ ctx[5](input_1);
	input_1.$on("submit", onSubmit);

	button0 = new Button({
			props: {
				backgroundColour: "--colour-text-primary",
				hoverColour: "--colour-text-secondary",
				textColour: "--colour-background-primary",
				icon: "settings",
				$$slots: { default: [create_default_slot_2] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	button0.$on("click", /*click_handler*/ ctx[6]);

	button1 = new Button({
			props: {
				icon: "nat",
				$$slots: { default: [create_default_slot_1] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	button1.$on("click", onSubmit);

	dialog = new Dialog({
			props: {
				isDismissingOnBlur: true,
				isActiveW: /*customizeDialogIsActiveW*/ ctx[3]
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			key_block.c();
			t0 = space();
			container5 = element("container");
			container1 = element("container");
			container0 = element("container");
			create_component(input_1.$$.fragment);
			t1 = space();
			container4 = element("container");
			container2 = element("container");
			create_component(button0.$$.fragment);
			t2 = space();
			container3 = element("container");
			create_component(button1.$$.fragment);
			t3 = space();
			create_component(dialog.$$.fragment);
			attr_dev(container0, "class", "svelte-d23m9n");
			add_location(container0, file$b, 66, 3, 1773);
			attr_dev(container1, "class", "input svelte-d23m9n");
			add_location(container1, file$b, 63, 2, 1735);
			attr_dev(container2, "class", "customize svelte-d23m9n");
			add_location(container2, file$b, 89, 3, 2318);
			attr_dev(container3, "class", "submit svelte-d23m9n");
			add_location(container3, file$b, 102, 3, 2648);
			attr_dev(container4, "class", "buttons svelte-d23m9n");
			add_location(container4, file$b, 86, 2, 2278);
			attr_dev(container5, "class", "content svelte-d23m9n");
			add_location(container5, file$b, 60, 1, 1698);
		},
		m: function mount(target, anchor) {
			key_block.m(target, anchor);
			insert_dev(target, t0, anchor);
			insert_dev(target, container5, anchor);
			append_dev(container5, container1);
			append_dev(container1, container0);
			mount_component(input_1, container0, null);
			append_dev(container5, t1);
			append_dev(container5, container4);
			append_dev(container4, container2);
			mount_component(button0, container2, null);
			append_dev(container4, t2);
			append_dev(container4, container3);
			mount_component(button1, container3, null);
			insert_dev(target, t3, anchor);
			mount_component(dialog, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			if (dirty & /*$gradientRemountIndexW*/ 4 && safe_not_equal(previous_key, previous_key = /*$gradientRemountIndexW*/ ctx[2])) {
				group_outros();
				transition_out(key_block, 1, 1, noop$1);
				check_outros();
				key_block = create_key_block$1(ctx);
				key_block.c();
				transition_in(key_block);
				key_block.m(t0.parentNode, t0);
			} else {
				key_block.p(ctx, dirty);
			}

			const input_1_changes = {};

			if (!updating_value && dirty & /*name*/ 1) {
				updating_value = true;
				input_1_changes.value = /*name*/ ctx[0];
				add_flush_callback(() => updating_value = false);
			}

			input_1.$set(input_1_changes);
			const button0_changes = {};

			if (dirty & /*$$scope*/ 256) {
				button0_changes.$$scope = { dirty, ctx };
			}

			button0.$set(button0_changes);
			const button1_changes = {};

			if (dirty & /*$$scope*/ 256) {
				button1_changes.$$scope = { dirty, ctx };
			}

			button1.$set(button1_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(key_block);
			transition_in(input_1.$$.fragment, local);
			transition_in(button0.$$.fragment, local);
			transition_in(button1.$$.fragment, local);
			transition_in(dialog.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(key_block);
			transition_out(input_1.$$.fragment, local);
			transition_out(button0.$$.fragment, local);
			transition_out(button1.$$.fragment, local);
			transition_out(dialog.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			key_block.d(detaching);
			if (detaching) detach_dev(t0);
			if (detaching) detach_dev(container5);
			/*input_1_binding*/ ctx[5](null);
			destroy_component(input_1);
			destroy_component(button0);
			destroy_component(button1);
			if (detaching) detach_dev(t3);
			destroy_component(dialog, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot$5.name,
		type: "slot",
		source: "(43:0) <Fragment   isPadded={true}   isInAnimated={true}   isOutAnimated={true}   height='100vh'   width='100%'   align='flex-end'   justify='center'  >",
		ctx
	});

	return block;
}

function create_fragment$b(ctx) {
	let fragment;
	let current;

	fragment = new Fragment({
			props: {
				isPadded: true,
				isInAnimated: true,
				isOutAnimated: true,
				height: "100vh",
				width: "100%",
				align: "flex-end",
				justify: "center",
				$$slots: { default: [create_default_slot$5] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(fragment.$$.fragment);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			mount_component(fragment, target, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			const fragment_changes = {};

			if (dirty & /*$$scope, name, input, $gradientRemountIndexW*/ 263) {
				fragment_changes.$$scope = { dirty, ctx };
			}

			fragment.$set(fragment_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(fragment.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(fragment.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(fragment, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$b.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

const gradientRemountIndexW = writable(1);
let timeoutHandle;

function scheduleGradientRemount() {
	clearTimeout(timeoutHandle);

	timeoutHandle = setTimeout(
		() => {
			gradientRemountIndexW.update(gradientRemountIndexWValue => ++gradientRemountIndexWValue);
		},
		1000
	);
}

function onSubmit() {
	
}

function instance$b($$self, $$props, $$invalidate) {
	let $gradientRemountIndexW;
	validate_store(gradientRemountIndexW, "gradientRemountIndexW");
	component_subscribe($$self, gradientRemountIndexW, $$value => $$invalidate(2, $gradientRemountIndexW = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("LandingRoute", slots, []);
	let name = "";
	let input;

	onMount(() => {
		input.focus();
	});

	Ctx.globalHamburger = {
		"report bug": () => {
			document.location.href = "https://docs.google.com/forms/d/e/1FAIpQLSd9Rgu6Wur1LbGHS8ce9hTRJLy06MrbOIrfvghNlvHJ6bOlhA/viewform?usp=sf_link";
		}
	};

	Ctx.globalToasts = [
		ToastItem.from({
			duration: 100000,
			text: "yo! just a reminder issa preview, not everything works yet (:",
			level: Levels.INFO
		})
	];

	const customizeDialogIsActiveW = writable(false);
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<LandingRoute> was created with unknown prop '${key}'`);
	});

	function input_1_value_binding(value) {
		name = value;
		$$invalidate(0, name);
	}

	function input_1_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			input = $$value;
			$$invalidate(1, input);
		});
	}

	const click_handler = () => customizeDialogIsActiveW.set(true);

	$$self.$capture_state = () => ({
		gradientRemountIndexW,
		timeoutHandle,
		scheduleGradientRemount,
		onMount,
		writable,
		push,
		Ctx,
		Button,
		Input,
		Fragment,
		Dialog,
		Gradient2,
		ToastItem,
		Levels,
		name,
		input,
		onSubmit,
		customizeDialogIsActiveW,
		$gradientRemountIndexW
	});

	$$self.$inject_state = $$props => {
		if ("name" in $$props) $$invalidate(0, name = $$props.name);
		if ("input" in $$props) $$invalidate(1, input = $$props.input);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		name,
		input,
		$gradientRemountIndexW,
		customizeDialogIsActiveW,
		input_1_value_binding,
		input_1_binding,
		click_handler
	];
}

class LandingRoute extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "LandingRoute",
			options,
			id: create_fragment$b.name
		});
	}
}

var undefined$a = undefined;

/* src\ui\blocks\Lottie.svelte generated by Svelte v3.38.2 */

const { Object: Object_1$1 } = globals;
const file$a = "src\\ui\\blocks\\Lottie.svelte";

function create_fragment$a(ctx) {
	let component;
	let container;

	const block = {
		c: function create() {
			component = element("component");
			container = element("container");
			set_style(container, "--colour-override", CSSUtility.parse(/*overrideColour*/ ctx[4]) + "\r\n\t\t");
			attr_dev(container, "class", "svelte-1slyjdr");
			toggle_class(container, "unloaded", /*animation*/ ctx[0] == null);
			toggle_class(container, "override", /*overrideColour*/ ctx[4]);
			add_location(container, file$a, 58, 1, 2666);
			set_style(component, "--height", CSSUtility.parse(/*height*/ ctx[2]));
			set_style(component, "--width", CSSUtility.parse(/*width*/ ctx[3]));
			attr_dev(component, "class", "svelte-1slyjdr");
			add_location(component, file$a, 52, 0, 2556);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, component, anchor);
			append_dev(component, container);
			/*container_binding*/ ctx[11](container);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*overrideColour*/ 16) {
				set_style(container, "--colour-override", CSSUtility.parse(/*overrideColour*/ ctx[4]) + "\r\n\t\t");
			}

			if (dirty & /*animation*/ 1) {
				toggle_class(container, "unloaded", /*animation*/ ctx[0] == null);
			}

			if (dirty & /*overrideColour*/ 16) {
				toggle_class(container, "override", /*overrideColour*/ ctx[4]);
			}

			if (dirty & /*height*/ 4) {
				set_style(component, "--height", CSSUtility.parse(/*height*/ ctx[2]));
			}

			if (dirty & /*width*/ 8) {
				set_style(component, "--width", CSSUtility.parse(/*width*/ ctx[3]));
			}
		},
		i: noop$1,
		o: noop$1,
		d: function destroy(detaching) {
			if (detaching) detach_dev(component);
			/*container_binding*/ ctx[11](null);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$a.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$a($$self, $$props, $$invalidate) {
	let $animationCurrentFrameW,
		$$unsubscribe_animationCurrentFrameW = noop$1,
		$$subscribe_animationCurrentFrameW = () => ($$unsubscribe_animationCurrentFrameW(), $$unsubscribe_animationCurrentFrameW = subscribe(animationCurrentFrameW, $$value => $$invalidate(10, $animationCurrentFrameW = $$value)), animationCurrentFrameW);

	$$self.$$.on_destroy.push(() => $$unsubscribe_animationCurrentFrameW());
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("Lottie", slots, []);

	var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P
			? value
			: new P(function (resolve) {
						resolve(value);
					});
		}

		return new (P || (P = Promise))(function (resolve, reject) {
				function fulfilled(value) {
					try {
						step(generator.next(value));
					} catch(e) {
						reject(e);
					}
				}

				function rejected(value) {
					try {
						step(generator["throw"](value));
					} catch(e) {
						reject(e);
					}
				}

				function step(result) {
					result.done
					? resolve(result.value)
					: adopt(result.value).then(fulfilled, rejected);
				}

				step((generator = generator.apply(thisArg, _arguments || [])).next());
			});
	};

	
	
	let { animationCurrentFrameW = writable(0) } = $$props;
	validate_store(animationCurrentFrameW, "animationCurrentFrameW");
	$$subscribe_animationCurrentFrameW();
	let { animation = undefined } = $$props;
	let { src = "" } = $$props;
	let { animationData = undefined } = $$props;
	let { height = "100%" } = $$props;
	let { width = "100%" } = $$props;
	let { options = {} } = $$props;
	let { overrideColour = "" } = $$props;
	let containerDomContent;
	let isAnimationCurrentFrameBeingUpdatedInternally = false;
	let isAnimationCurrentFrameBeingUpdatedExternally = false;

	onMount(() => __awaiter(void 0, void 0, void 0, function* () {
		var _a;
		const lottiePromise = import('./lottie-da260d24.js').then(function (n) { return n.l; });

		const json = (_a = yield Promise.resolve(animationData)) !== null && _a !== void 0
		? _a
		: !src ? {} : yield (yield fetch(src)).json();

		const lottie = yield lottiePromise;

		if (animation == null) {
			$$invalidate(0, animation = lottie.loadAnimation(Object.assign(
				{
					container: containerDomContent,
					animationData: json,
					autoplay: true,
					loop: true
				},
				options
			)));
		}

		animation.addEventListener("enterFrame", () => {
			var _a;

			if (isAnimationCurrentFrameBeingUpdatedExternally) {
				isAnimationCurrentFrameBeingUpdatedExternally = false;
				return;
			}

			$$invalidate(9, isAnimationCurrentFrameBeingUpdatedInternally = true);

			animationCurrentFrameW.set((_a = animation === null || animation === void 0
			? void 0
			: animation.currentRawFrame) !== null && _a !== void 0
			? _a
			: -1);
		});
	}));

	const writable_props = [
		"animationCurrentFrameW",
		"animation",
		"src",
		"animationData",
		"height",
		"width",
		"options",
		"overrideColour"
	];

	Object_1$1.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Lottie> was created with unknown prop '${key}'`);
	});

	function container_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			containerDomContent = $$value;
			$$invalidate(5, containerDomContent);
		});
	}

	$$self.$$set = $$props => {
		if ("animationCurrentFrameW" in $$props) $$subscribe_animationCurrentFrameW($$invalidate(1, animationCurrentFrameW = $$props.animationCurrentFrameW));
		if ("animation" in $$props) $$invalidate(0, animation = $$props.animation);
		if ("src" in $$props) $$invalidate(6, src = $$props.src);
		if ("animationData" in $$props) $$invalidate(7, animationData = $$props.animationData);
		if ("height" in $$props) $$invalidate(2, height = $$props.height);
		if ("width" in $$props) $$invalidate(3, width = $$props.width);
		if ("options" in $$props) $$invalidate(8, options = $$props.options);
		if ("overrideColour" in $$props) $$invalidate(4, overrideColour = $$props.overrideColour);
	};

	$$self.$capture_state = () => ({
		__awaiter,
		onMount,
		writable,
		CSSUtility,
		animationCurrentFrameW,
		animation,
		src,
		animationData,
		height,
		width,
		options,
		overrideColour,
		containerDomContent,
		isAnimationCurrentFrameBeingUpdatedInternally,
		isAnimationCurrentFrameBeingUpdatedExternally,
		$animationCurrentFrameW
	});

	$$self.$inject_state = $$props => {
		if ("__awaiter" in $$props) __awaiter = $$props.__awaiter;
		if ("animationCurrentFrameW" in $$props) $$subscribe_animationCurrentFrameW($$invalidate(1, animationCurrentFrameW = $$props.animationCurrentFrameW));
		if ("animation" in $$props) $$invalidate(0, animation = $$props.animation);
		if ("src" in $$props) $$invalidate(6, src = $$props.src);
		if ("animationData" in $$props) $$invalidate(7, animationData = $$props.animationData);
		if ("height" in $$props) $$invalidate(2, height = $$props.height);
		if ("width" in $$props) $$invalidate(3, width = $$props.width);
		if ("options" in $$props) $$invalidate(8, options = $$props.options);
		if ("overrideColour" in $$props) $$invalidate(4, overrideColour = $$props.overrideColour);
		if ("containerDomContent" in $$props) $$invalidate(5, containerDomContent = $$props.containerDomContent);
		if ("isAnimationCurrentFrameBeingUpdatedInternally" in $$props) $$invalidate(9, isAnimationCurrentFrameBeingUpdatedInternally = $$props.isAnimationCurrentFrameBeingUpdatedInternally);
		if ("isAnimationCurrentFrameBeingUpdatedExternally" in $$props) isAnimationCurrentFrameBeingUpdatedExternally = $$props.isAnimationCurrentFrameBeingUpdatedExternally;
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*isAnimationCurrentFrameBeingUpdatedInternally, animation, $animationCurrentFrameW*/ 1537) {
			$: isAnimationCurrentFrameBeingUpdatedInternally
			? $$invalidate(9, isAnimationCurrentFrameBeingUpdatedInternally = false)
			: (animation === null || animation === void 0
				? void 0
				: animation.goToAndStop($animationCurrentFrameW), isAnimationCurrentFrameBeingUpdatedExternally = true);
		}
	};

	return [
		animation,
		animationCurrentFrameW,
		height,
		width,
		overrideColour,
		containerDomContent,
		src,
		animationData,
		options,
		isAnimationCurrentFrameBeingUpdatedInternally,
		$animationCurrentFrameW,
		container_binding
	];
}

class Lottie extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$a, create_fragment$a, safe_not_equal, {
			animationCurrentFrameW: 1,
			animation: 0,
			src: 6,
			animationData: 7,
			height: 2,
			width: 3,
			options: 8,
			overrideColour: 4
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Lottie",
			options,
			id: create_fragment$a.name
		});
	}

	get animationCurrentFrameW() {
		return this.$$.ctx[1];
	}

	set animationCurrentFrameW(animationCurrentFrameW) {
		this.$set({ animationCurrentFrameW });
		flush();
	}

	get animation() {
		return this.$$.ctx[0];
	}

	set animation(animation) {
		this.$set({ animation });
		flush();
	}

	get src() {
		return this.$$.ctx[6];
	}

	set src(src) {
		this.$set({ src });
		flush();
	}

	get animationData() {
		return this.$$.ctx[7];
	}

	set animationData(animationData) {
		this.$set({ animationData });
		flush();
	}

	get height() {
		return this.$$.ctx[2];
	}

	set height(height) {
		this.$set({ height });
		flush();
	}

	get width() {
		return this.$$.ctx[3];
	}

	set width(width) {
		this.$set({ width });
		flush();
	}

	get options() {
		return this.$$.ctx[8];
	}

	set options(options) {
		this.$set({ options });
		flush();
	}

	get overrideColour() {
		return this.$$.ctx[4];
	}

	set overrideColour(overrideColour) {
		this.$set({ overrideColour });
		flush();
	}
}

/* src\ui\blocks\buttons\LottieToggleButton.svelte generated by Svelte v3.38.2 */
const file$9 = "src\\ui\\blocks\\buttons\\LottieToggleButton.svelte";

// (24:1) <Button    {...$$restProps}    {height}    {width}    {backgroundColour}    {hoverColour}    isText={false}    {padding}    roundness='--roundness'    on:click={() => {     isActiveW.update((value) => !value);       dispatch('click');    }}   >
function create_default_slot$4(ctx) {
	let lottie;
	let updating_animation;
	let current;

	function lottie_animation_binding(value) {
		/*lottie_animation_binding*/ ctx[14](value);
	}

	let lottie_props = {
		src: /*src*/ ctx[1],
		animationData: /*animationData*/ ctx[2],
		overrideColour: /*overrideColour*/ ctx[7],
		options: { autoplay: false, loop: false }
	};

	if (/*animation*/ ctx[9] !== void 0) {
		lottie_props.animation = /*animation*/ ctx[9];
	}

	lottie = new Lottie({ props: lottie_props, $$inline: true });
	binding_callbacks.push(() => bind(lottie, "animation", lottie_animation_binding));

	const block = {
		c: function create() {
			create_component(lottie.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(lottie, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const lottie_changes = {};
			if (dirty & /*src*/ 2) lottie_changes.src = /*src*/ ctx[1];
			if (dirty & /*animationData*/ 4) lottie_changes.animationData = /*animationData*/ ctx[2];
			if (dirty & /*overrideColour*/ 128) lottie_changes.overrideColour = /*overrideColour*/ ctx[7];

			if (!updating_animation && dirty & /*animation*/ 512) {
				updating_animation = true;
				lottie_changes.animation = /*animation*/ ctx[9];
				add_flush_callback(() => updating_animation = false);
			}

			lottie.$set(lottie_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(lottie.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(lottie.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(lottie, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot$4.name,
		type: "slot",
		source: "(24:1) <Button    {...$$restProps}    {height}    {width}    {backgroundColour}    {hoverColour}    isText={false}    {padding}    roundness='--roundness'    on:click={() => {     isActiveW.update((value) => !value);       dispatch('click');    }}   >",
		ctx
	});

	return block;
}

function create_fragment$9(ctx) {
	let component;
	let button;
	let current;

	const button_spread_levels = [
		/*$$restProps*/ ctx[11],
		{ height: /*height*/ ctx[5] },
		{ width: /*width*/ ctx[6] },
		{
			backgroundColour: /*backgroundColour*/ ctx[4]
		},
		{ hoverColour: /*hoverColour*/ ctx[3] },
		{ isText: false },
		{ padding: /*padding*/ ctx[8] },
		{ roundness: "--roundness" }
	];

	let button_props = {
		$$slots: { default: [create_default_slot$4] },
		$$scope: { ctx }
	};

	for (let i = 0; i < button_spread_levels.length; i += 1) {
		button_props = assign(button_props, button_spread_levels[i]);
	}

	button = new Button({ props: button_props, $$inline: true });
	button.$on("click", /*click_handler*/ ctx[15]);

	const block = {
		c: function create() {
			component = element("component");
			create_component(button.$$.fragment);
			add_location(component, file$9, 22, 0, 875);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, component, anchor);
			mount_component(button, component, null);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			const button_changes = (dirty & /*$$restProps, height, width, backgroundColour, hoverColour, padding*/ 2424)
			? get_spread_update(button_spread_levels, [
					dirty & /*$$restProps*/ 2048 && get_spread_object(/*$$restProps*/ ctx[11]),
					dirty & /*height*/ 32 && { height: /*height*/ ctx[5] },
					dirty & /*width*/ 64 && { width: /*width*/ ctx[6] },
					dirty & /*backgroundColour*/ 16 && {
						backgroundColour: /*backgroundColour*/ ctx[4]
					},
					dirty & /*hoverColour*/ 8 && { hoverColour: /*hoverColour*/ ctx[3] },
					button_spread_levels[5],
					dirty & /*padding*/ 256 && { padding: /*padding*/ ctx[8] },
					button_spread_levels[7]
				])
			: {};

			if (dirty & /*$$scope, src, animationData, overrideColour, animation*/ 66182) {
				button_changes.$$scope = { dirty, ctx };
			}

			button.$set(button_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(button.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(button.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(component);
			destroy_component(button);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$9.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$9($$self, $$props, $$invalidate) {
	const omit_props_names = [
		"isActive","isActiveW","src","animationData","hoverColour","backgroundColour","height","width","overrideColour","padding"
	];

	let $$restProps = compute_rest_props($$props, omit_props_names);

	let $isActiveW,
		$$unsubscribe_isActiveW = noop$1,
		$$subscribe_isActiveW = () => ($$unsubscribe_isActiveW(), $$unsubscribe_isActiveW = subscribe(isActiveW, $$value => $$invalidate(13, $isActiveW = $$value)), isActiveW);

	$$self.$$.on_destroy.push(() => $$unsubscribe_isActiveW());
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("LottieToggleButton", slots, []);
	
	
	let { isActive = false } = $$props;
	let { isActiveW = writable(isActive) } = $$props;
	validate_store(isActiveW, "isActiveW");
	$$subscribe_isActiveW();
	let { src = "" } = $$props;
	let { animationData = {} } = $$props;
	let { hoverColour = "#0000" } = $$props;
	let { backgroundColour = "#0000" } = $$props;
	let { height = "100%" } = $$props;
	let { width = "100%" } = $$props;
	let { overrideColour = "" } = $$props;
	let { padding = "16px 16px" } = $$props;
	let animation;
	const dispatch = createEventDispatcher();

	function lottie_animation_binding(value) {
		animation = value;
		$$invalidate(9, animation);
	}

	const click_handler = () => {
		isActiveW.update(value => !value);
		dispatch("click");
	};

	$$self.$$set = $$new_props => {
		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
		$$invalidate(11, $$restProps = compute_rest_props($$props, omit_props_names));
		if ("isActive" in $$new_props) $$invalidate(12, isActive = $$new_props.isActive);
		if ("isActiveW" in $$new_props) $$subscribe_isActiveW($$invalidate(0, isActiveW = $$new_props.isActiveW));
		if ("src" in $$new_props) $$invalidate(1, src = $$new_props.src);
		if ("animationData" in $$new_props) $$invalidate(2, animationData = $$new_props.animationData);
		if ("hoverColour" in $$new_props) $$invalidate(3, hoverColour = $$new_props.hoverColour);
		if ("backgroundColour" in $$new_props) $$invalidate(4, backgroundColour = $$new_props.backgroundColour);
		if ("height" in $$new_props) $$invalidate(5, height = $$new_props.height);
		if ("width" in $$new_props) $$invalidate(6, width = $$new_props.width);
		if ("overrideColour" in $$new_props) $$invalidate(7, overrideColour = $$new_props.overrideColour);
		if ("padding" in $$new_props) $$invalidate(8, padding = $$new_props.padding);
	};

	$$self.$capture_state = () => ({
		writable,
		createEventDispatcher,
		Button,
		Lottie,
		isActive,
		isActiveW,
		src,
		animationData,
		hoverColour,
		backgroundColour,
		height,
		width,
		overrideColour,
		padding,
		animation,
		dispatch,
		$isActiveW
	});

	$$self.$inject_state = $$new_props => {
		if ("isActive" in $$props) $$invalidate(12, isActive = $$new_props.isActive);
		if ("isActiveW" in $$props) $$subscribe_isActiveW($$invalidate(0, isActiveW = $$new_props.isActiveW));
		if ("src" in $$props) $$invalidate(1, src = $$new_props.src);
		if ("animationData" in $$props) $$invalidate(2, animationData = $$new_props.animationData);
		if ("hoverColour" in $$props) $$invalidate(3, hoverColour = $$new_props.hoverColour);
		if ("backgroundColour" in $$props) $$invalidate(4, backgroundColour = $$new_props.backgroundColour);
		if ("height" in $$props) $$invalidate(5, height = $$new_props.height);
		if ("width" in $$props) $$invalidate(6, width = $$new_props.width);
		if ("overrideColour" in $$props) $$invalidate(7, overrideColour = $$new_props.overrideColour);
		if ("padding" in $$props) $$invalidate(8, padding = $$new_props.padding);
		if ("animation" in $$props) $$invalidate(9, animation = $$new_props.animation);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*isActiveW, animation*/ 513) {
			$: isActiveW.set(-(animation === null || animation === void 0
			? void 0
			: animation.playDirection) > 0);
		}

		if ($$self.$$.dirty & /*animation, $isActiveW*/ 8704) {
			$: (animation === null || animation === void 0
			? void 0
			: animation.setDirection($isActiveW ? 1 : -1), animation === null || animation === void 0
			? void 0
			: animation.play());
		}
	};

	return [
		isActiveW,
		src,
		animationData,
		hoverColour,
		backgroundColour,
		height,
		width,
		overrideColour,
		padding,
		animation,
		dispatch,
		$$restProps,
		isActive,
		$isActiveW,
		lottie_animation_binding,
		click_handler
	];
}

class LottieToggleButton extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$9, create_fragment$9, safe_not_equal, {
			isActive: 12,
			isActiveW: 0,
			src: 1,
			animationData: 2,
			hoverColour: 3,
			backgroundColour: 4,
			height: 5,
			width: 6,
			overrideColour: 7,
			padding: 8
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "LottieToggleButton",
			options,
			id: create_fragment$9.name
		});
	}

	get isActive() {
		return this.$$.ctx[12];
	}

	set isActive(isActive) {
		this.$set({ isActive });
		flush();
	}

	get isActiveW() {
		return this.$$.ctx[0];
	}

	set isActiveW(isActiveW) {
		this.$set({ isActiveW });
		flush();
	}

	get src() {
		return this.$$.ctx[1];
	}

	set src(src) {
		this.$set({ src });
		flush();
	}

	get animationData() {
		return this.$$.ctx[2];
	}

	set animationData(animationData) {
		this.$set({ animationData });
		flush();
	}

	get hoverColour() {
		return this.$$.ctx[3];
	}

	set hoverColour(hoverColour) {
		this.$set({ hoverColour });
		flush();
	}

	get backgroundColour() {
		return this.$$.ctx[4];
	}

	set backgroundColour(backgroundColour) {
		this.$set({ backgroundColour });
		flush();
	}

	get height() {
		return this.$$.ctx[5];
	}

	set height(height) {
		this.$set({ height });
		flush();
	}

	get width() {
		return this.$$.ctx[6];
	}

	set width(width) {
		this.$set({ width });
		flush();
	}

	get overrideColour() {
		return this.$$.ctx[7];
	}

	set overrideColour(overrideColour) {
		this.$set({ overrideColour });
		flush();
	}

	get padding() {
		return this.$$.ctx[8];
	}

	set padding(padding) {
		this.$set({ padding });
		flush();
	}
}

const v = "5.6.3";
const fr = 120;
const ip = 0;
const op = 90;
const w = 412;
const h = 312;
const nm = "Comp 1";
const ddd = 0;
const assets = [
	{
		id: "comp_0",
		layers: [
			{
				ddd: 0,
				ind: 1,
				ty: 4,
				nm: "Shape Layer 3",
				sr: 1,
				ks: {
					p: {
						a: 1,
						k: [
							{
								i: {
									x: 0.27,
									y: 1
								},
								o: {
									x: 0.73,
									y: 0
								},
								t: 10,
								s: [
									300,
									200,
									0
								],
								to: [
									0,
									16.667,
									0
								],
								ti: [
									0,
									-16.667,
									0
								]
							},
							{
								i: {
									x: 0.27,
									y: 0.27
								},
								o: {
									x: 0.73,
									y: 0.73
								},
								t: 30,
								s: [
									300,
									300,
									0
								],
								to: [
									0,
									0,
									0
								],
								ti: [
									0,
									0,
									0
								]
							},
							{
								i: {
									x: 0.27,
									y: 1
								},
								o: {
									x: 0.73,
									y: 0
								},
								t: 50,
								s: [
									300,
									300,
									0
								],
								to: [
									-16.667,
									0,
									0
								],
								ti: [
									16.667,
									0,
									0
								]
							},
							{
								t: 70,
								s: [
									200,
									300,
									0
								]
							}
						]
					}
				},
				ao: 0,
				shapes: [
					{
						ty: "gr",
						it: [
							{
								ty: "rc",
								d: 1,
								s: {
									a: 0,
									k: [
										100,
										100
									]
								},
								p: {
									a: 0,
									k: [
										0,
										0
									]
								},
								r: {
									a: 0,
									k: 0
								},
								nm: "Rectangle Path 1",
								hd: false
							},
							{
								ty: "st",
								c: {
									a: 0,
									k: [
										1,
										1,
										1,
										1
									]
								},
								o: {
									a: 0,
									k: 100
								},
								w: {
									a: 1,
									k: [
										{
											t: 0,
											s: [
												12
											],
											h: 1
										},
										{
											t: 42,
											s: [
												0
											],
											h: 1
										}
									]
								},
								lc: 1,
								lj: 1,
								ml: 4,
								bm: 0,
								nm: "Stroke 1",
								hd: false
							},
							{
								ty: "fl",
								c: {
									a: 0,
									k: [
										1,
										1,
										1,
										1
									]
								},
								o: {
									a: 1,
									k: [
										{
											t: 0,
											s: [
												0
											],
											h: 1
										},
										{
											t: 42,
											s: [
												100
											],
											h: 1
										}
									]
								},
								r: 1,
								bm: 0,
								nm: "Fill 1",
								hd: false
							},
							{
								ty: "tr",
								p: {
									a: 0,
									k: [
										0,
										0
									]
								},
								a: {
									a: 0,
									k: [
										-50,
										-50
									]
								},
								s: {
									a: 0,
									k: [
										100,
										100
									]
								},
								r: {
									a: 0,
									k: 0
								},
								o: {
									a: 0,
									k: 100
								},
								sk: {
									a: 0,
									k: 0
								},
								sa: {
									a: 0,
									k: 0
								},
								nm: "Transform"
							}
						],
						nm: "Rectangle 1",
						bm: 0,
						hd: false
					}
				],
				ip: 0,
				op: 90,
				st: 10,
				bm: 0
			},
			{
				ddd: 0,
				ind: 2,
				ty: 4,
				nm: "Shape Layer 4",
				sr: 1,
				ks: {
					p: {
						a: 1,
						k: [
							{
								i: {
									x: 0.27,
									y: 1
								},
								o: {
									x: 0.73,
									y: 0
								},
								t: 8,
								s: [
									100,
									200,
									0
								],
								to: [
									16.667,
									0,
									0
								],
								ti: [
									0,
									0,
									0
								]
							},
							{
								i: {
									x: 0.27,
									y: 1
								},
								o: {
									x: 0.73,
									y: 0
								},
								t: 28,
								s: [
									200,
									200,
									0
								],
								to: [
									0,
									0,
									0
								],
								ti: [
									0,
									0,
									0
								]
							},
							{
								i: {
									x: 0.27,
									y: 0.27
								},
								o: {
									x: 0.73,
									y: 0.73
								},
								t: 48,
								s: [
									300,
									200,
									0
								],
								to: [
									0,
									0,
									0
								],
								ti: [
									0,
									0,
									0
								]
							},
							{
								i: {
									x: 0.27,
									y: 1
								},
								o: {
									x: 0.73,
									y: 0
								},
								t: 68,
								s: [
									300,
									200,
									0
								],
								to: [
									0,
									0,
									0
								],
								ti: [
									0,
									0,
									0
								]
							},
							{
								t: 88,
								s: [
									300,
									300,
									0
								]
							}
						]
					}
				},
				ao: 0,
				shapes: [
					{
						ty: "gr",
						it: [
							{
								ty: "rc",
								d: 1,
								s: {
									a: 0,
									k: [
										100,
										100
									]
								},
								p: {
									a: 0,
									k: [
										0,
										0
									]
								},
								r: {
									a: 0,
									k: 0
								},
								nm: "Rectangle Path 1",
								hd: false
							},
							{
								ty: "st",
								c: {
									a: 0,
									k: [
										1,
										1,
										1,
										1
									]
								},
								o: {
									a: 0,
									k: 100
								},
								w: {
									a: 1,
									k: [
										{
											t: 0,
											s: [
												12
											],
											h: 1
										},
										{
											t: 34,
											s: [
												0
											],
											h: 1
										}
									]
								},
								lc: 1,
								lj: 1,
								ml: 4,
								bm: 0,
								nm: "Stroke 1",
								hd: false
							},
							{
								ty: "fl",
								c: {
									a: 0,
									k: [
										1,
										1,
										1,
										1
									]
								},
								o: {
									a: 1,
									k: [
										{
											t: 0,
											s: [
												0
											],
											h: 1
										},
										{
											t: 34,
											s: [
												100
											],
											h: 1
										}
									]
								},
								r: 1,
								bm: 0,
								nm: "Fill 1",
								hd: false
							},
							{
								ty: "tr",
								p: {
									a: 0,
									k: [
										0,
										0
									]
								},
								a: {
									a: 0,
									k: [
										-50,
										-50
									]
								},
								s: {
									a: 0,
									k: [
										100,
										100
									]
								},
								r: {
									a: 0,
									k: 0
								},
								o: {
									a: 0,
									k: 100
								},
								sk: {
									a: 0,
									k: 0
								},
								sa: {
									a: 0,
									k: 0
								},
								nm: "Transform"
							}
						],
						nm: "Rectangle 1",
						bm: 0,
						hd: false
					}
				],
				ip: 0,
				op: 90,
				st: 8,
				bm: 0
			},
			{
				ddd: 0,
				ind: 3,
				ty: 4,
				nm: "Shape Layer 6",
				sr: 1,
				ks: {
					p: {
						a: 1,
						k: [
							{
								i: {
									x: 0.27,
									y: 1
								},
								o: {
									x: 0.73,
									y: 0
								},
								t: 26,
								s: [
									400,
									300,
									0
								],
								to: [
									0,
									-16.667,
									0
								],
								ti: [
									0,
									16.667,
									0
								]
							},
							{
								t: 46,
								s: [
									400,
									200,
									0
								]
							}
						]
					}
				},
				ao: 0,
				shapes: [
					{
						ty: "gr",
						it: [
							{
								ty: "rc",
								d: 1,
								s: {
									a: 0,
									k: [
										100,
										100
									]
								},
								p: {
									a: 0,
									k: [
										0,
										0
									]
								},
								r: {
									a: 0,
									k: 0
								},
								nm: "Rectangle Path 1",
								hd: false
							},
							{
								ty: "st",
								c: {
									a: 0,
									k: [
										1,
										1,
										1,
										1
									]
								},
								o: {
									a: 0,
									k: 100
								},
								w: {
									a: 1,
									k: [
										{
											t: 0,
											s: [
												12
											],
											h: 1
										},
										{
											t: 26,
											s: [
												0
											],
											h: 1
										}
									]
								},
								lc: 1,
								lj: 1,
								ml: 4,
								bm: 0,
								nm: "Stroke 1",
								hd: false
							},
							{
								ty: "fl",
								c: {
									a: 0,
									k: [
										1,
										1,
										1,
										1
									]
								},
								o: {
									a: 1,
									k: [
										{
											t: 0,
											s: [
												0
											],
											h: 1
										},
										{
											t: 26,
											s: [
												100
											],
											h: 1
										}
									]
								},
								r: 1,
								bm: 0,
								nm: "Fill 1",
								hd: false
							},
							{
								ty: "tr",
								p: {
									a: 0,
									k: [
										0,
										0
									]
								},
								a: {
									a: 0,
									k: [
										-50,
										-50
									]
								},
								s: {
									a: 0,
									k: [
										100,
										100
									]
								},
								r: {
									a: 0,
									k: 0
								},
								o: {
									a: 0,
									k: 100
								},
								sk: {
									a: 0,
									k: 0
								},
								sa: {
									a: 0,
									k: 0
								},
								nm: "Transform"
							}
						],
						nm: "Rectangle 1",
						bm: 0,
						hd: false
					}
				],
				ip: 0,
				op: 90,
				st: 6,
				bm: 0
			},
			{
				ddd: 0,
				ind: 4,
				ty: 4,
				nm: "Shape Layer 5",
				sr: 1,
				ks: {
					p: {
						a: 1,
						k: [
							{
								i: {
									x: 0.27,
									y: 1
								},
								o: {
									x: 0.73,
									y: 0
								},
								t: 4,
								s: [
									200,
									300,
									0
								],
								to: [
									-16.667,
									0,
									0
								],
								ti: [
									0,
									0,
									0
								]
							},
							{
								i: {
									x: 0.27,
									y: 1
								},
								o: {
									x: 0.73,
									y: 0
								},
								t: 24,
								s: [
									100,
									300,
									0
								],
								to: [
									0,
									0,
									0
								],
								ti: [
									0,
									0,
									0
								]
							},
							{
								t: 44,
								s: [
									100,
									200,
									0
								]
							}
						]
					}
				},
				ao: 0,
				shapes: [
					{
						ty: "gr",
						it: [
							{
								ty: "rc",
								d: 1,
								s: {
									a: 0,
									k: [
										100,
										100
									]
								},
								p: {
									a: 0,
									k: [
										0,
										0
									]
								},
								r: {
									a: 0,
									k: 0
								},
								nm: "Rectangle Path 1",
								hd: false
							},
							{
								ty: "st",
								c: {
									a: 0,
									k: [
										1,
										1,
										1,
										1
									]
								},
								o: {
									a: 0,
									k: 100
								},
								w: {
									a: 1,
									k: [
										{
											t: 0,
											s: [
												12
											],
											h: 1
										},
										{
											t: 18,
											s: [
												0
											],
											h: 1
										}
									]
								},
								lc: 1,
								lj: 1,
								ml: 4,
								bm: 0,
								nm: "Stroke 1",
								hd: false
							},
							{
								ty: "fl",
								c: {
									a: 0,
									k: [
										1,
										1,
										1,
										1
									]
								},
								o: {
									a: 1,
									k: [
										{
											t: 0,
											s: [
												0
											],
											h: 1
										},
										{
											t: 18,
											s: [
												100
											],
											h: 1
										}
									]
								},
								r: 1,
								bm: 0,
								nm: "Fill 1",
								hd: false
							},
							{
								ty: "tr",
								p: {
									a: 0,
									k: [
										0,
										0
									]
								},
								a: {
									a: 0,
									k: [
										-50,
										-50
									]
								},
								s: {
									a: 0,
									k: [
										100,
										100
									]
								},
								r: {
									a: 0,
									k: 0
								},
								o: {
									a: 0,
									k: 100
								},
								sk: {
									a: 0,
									k: 0
								},
								sa: {
									a: 0,
									k: 0
								},
								nm: "Transform"
							}
						],
						nm: "Rectangle 1",
						bm: 0,
						hd: false
					}
				],
				ip: 0,
				op: 90,
				st: 4,
				bm: 0
			},
			{
				ddd: 0,
				ind: 5,
				ty: 4,
				nm: "Shape Layer 2",
				sr: 1,
				ks: {
					p: {
						a: 1,
						k: [
							{
								i: {
									x: 0.27,
									y: 0.27
								},
								o: {
									x: 0.73,
									y: 0.73
								},
								t: 2,
								s: [
									300,
									400,
									0
								],
								to: [
									0,
									0,
									0
								],
								ti: [
									0,
									0,
									0
								]
							},
							{
								i: {
									x: 0.27,
									y: 1
								},
								o: {
									x: 0.73,
									y: 0
								},
								t: 22,
								s: [
									300,
									400,
									0
								],
								to: [
									16.667,
									0,
									0
								],
								ti: [
									-16.667,
									0,
									0
								]
							},
							{
								t: 42,
								s: [
									400,
									400,
									0
								]
							}
						]
					}
				},
				ao: 0,
				shapes: [
					{
						ty: "gr",
						it: [
							{
								ty: "rc",
								d: 1,
								s: {
									a: 0,
									k: [
										100,
										100
									]
								},
								p: {
									a: 0,
									k: [
										0,
										0
									]
								},
								r: {
									a: 0,
									k: 0
								},
								nm: "Rectangle Path 1",
								hd: false
							},
							{
								ty: "st",
								c: {
									a: 0,
									k: [
										1,
										1,
										1,
										1
									]
								},
								o: {
									a: 0,
									k: 100
								},
								w: {
									a: 1,
									k: [
										{
											t: 0,
											s: [
												12
											],
											h: 1
										},
										{
											t: 10,
											s: [
												0
											],
											h: 1
										}
									]
								},
								lc: 1,
								lj: 1,
								ml: 4,
								bm: 0,
								nm: "Stroke 1",
								hd: false
							},
							{
								ty: "fl",
								c: {
									a: 0,
									k: [
										1,
										1,
										1,
										1
									]
								},
								o: {
									a: 1,
									k: [
										{
											t: 0,
											s: [
												0
											],
											h: 1
										},
										{
											t: 10,
											s: [
												100
											],
											h: 1
										}
									]
								},
								r: 1,
								bm: 0,
								nm: "Fill 1",
								hd: false
							},
							{
								ty: "tr",
								p: {
									a: 0,
									k: [
										0,
										0
									]
								},
								a: {
									a: 0,
									k: [
										-50,
										-50
									]
								},
								s: {
									a: 0,
									k: [
										100,
										100
									]
								},
								r: {
									a: 0,
									k: 0
								},
								o: {
									a: 0,
									k: 100
								},
								sk: {
									a: 0,
									k: 0
								},
								sa: {
									a: 0,
									k: 0
								},
								nm: "Transform"
							}
						],
						nm: "Rectangle 1",
						bm: 0,
						hd: false
					}
				],
				ip: 0,
				op: 90,
				st: 2,
				bm: 0
			},
			{
				ddd: 0,
				ind: 6,
				ty: 4,
				nm: "Shape Layer 1",
				sr: 1,
				ks: {
					p: {
						a: 1,
						k: [
							{
								i: {
									x: 0.27,
									y: 1
								},
								o: {
									x: 0.73,
									y: 0
								},
								t: 0,
								s: [
									100,
									400,
									0
								],
								to: [
									16.667,
									0,
									0
								],
								ti: [
									0,
									0,
									0
								]
							},
							{
								i: {
									x: 0.27,
									y: 1
								},
								o: {
									x: 0.73,
									y: 0
								},
								t: 20,
								s: [
									200,
									400,
									0
								],
								to: [
									0,
									0,
									0
								],
								ti: [
									0,
									0,
									0
								]
							},
							{
								i: {
									x: 0.27,
									y: 1
								},
								o: {
									x: 0.73,
									y: 0
								},
								t: 40,
								s: [
									200,
									300,
									0
								],
								to: [
									0,
									0,
									0
								],
								ti: [
									0,
									0,
									0
								]
							},
							{
								i: {
									x: 0.27,
									y: 1
								},
								o: {
									x: 0.73,
									y: 0
								},
								t: 60,
								s: [
									100,
									300,
									0
								],
								to: [
									0,
									0,
									0
								],
								ti: [
									0,
									-16.667,
									0
								]
							},
							{
								t: 80,
								s: [
									100,
									400,
									0
								]
							}
						]
					}
				},
				ao: 0,
				shapes: [
					{
						ty: "gr",
						it: [
							{
								ty: "rc",
								d: 1,
								s: {
									a: 0,
									k: [
										100,
										100
									]
								},
								p: {
									a: 0,
									k: [
										0,
										0
									]
								},
								r: {
									a: 0,
									k: 0
								},
								nm: "Rectangle Path 1",
								hd: false
							},
							{
								ty: "st",
								c: {
									a: 0,
									k: [
										1,
										1,
										1,
										1
									]
								},
								o: {
									a: 0,
									k: 100
								},
								w: {
									a: 1,
									k: [
										{
											t: 0,
											s: [
												12
											],
											h: 1
										},
										{
											t: 2,
											s: [
												0
											],
											h: 1
										}
									]
								},
								lc: 1,
								lj: 1,
								ml: 4,
								bm: 0,
								nm: "Stroke 1",
								hd: false
							},
							{
								ty: "fl",
								c: {
									a: 0,
									k: [
										1,
										1,
										1,
										1
									]
								},
								o: {
									a: 1,
									k: [
										{
											t: 0,
											s: [
												0
											],
											h: 1
										},
										{
											t: 2,
											s: [
												100
											],
											h: 1
										}
									]
								},
								r: 1,
								bm: 0,
								nm: "Fill 1",
								hd: false
							},
							{
								ty: "tr",
								p: {
									a: 0,
									k: [
										0,
										0
									]
								},
								a: {
									a: 0,
									k: [
										-50,
										-50
									]
								},
								s: {
									a: 0,
									k: [
										100,
										100
									]
								},
								r: {
									a: 0,
									k: 0
								},
								o: {
									a: 0,
									k: 100
								},
								sk: {
									a: 0,
									k: 0
								},
								sa: {
									a: 0,
									k: 0
								},
								nm: "Transform"
							}
						],
						nm: "Rectangle 1",
						bm: 0,
						hd: false
					}
				],
				ip: 0,
				op: 90,
				st: 0,
				bm: 0
			}
		]
	}
];
const layers = [
	{
		ddd: 0,
		ind: 1,
		ty: 0,
		nm: "Pre-comp 1",
		refId: "comp_0",
		sr: 1,
		ks: {
			p: {
				a: 0,
				k: [
					206,
					106,
					0
				]
			},
			a: {
				a: 0,
				k: [
					300,
					300,
					0
				]
			}
		},
		ao: 0,
		w: 600,
		h: 600,
		ip: 0,
		op: 90,
		st: 0,
		bm: 0
	}
];
const markers = [
];
var hamburger = {
	v: v,
	fr: fr,
	ip: ip,
	op: op,
	w: w,
	h: h,
	nm: nm,
	ddd: ddd,
	assets: assets,
	layers: layers,
	markers: markers
};

class AnimationFactory {
    ctx;
    constructor(thisArg) {
        this.ctx = thisArg;
    }
    create(options) {
        const baseObject = {
            data: undefined,
            ...options,
        };
        const baseItemsObject = {
            __caller: this.ctx.constructor,
            __container: options.type === 'null' || options.type === 'meta' ? null : this.createAndReturnNewContainerDom(options),
            __framesBeforeCurrent: this.ctx.getTotalFramesBeforeIndex(options.index || 0),
            uid: Math.round(performance.now()).toString(),
            domContent: null,
            offset: 0,
            disabled: false,
            object: {},
            respectDevicePixelRatio: true,
            totalFrames: null,
            bezier: [
                0,
                0,
                1,
                1,
            ],
            height: {
                maximum: null,
                minimum: null,
            },
            width: {
                maximum: null,
                minimum: null,
            },
            onFrame: () => { },
            onVisible: () => { },
            onHidden: () => { },
            onRedraw: () => { },
            ...options.items,
        };
        return {
            ...baseObject,
            items: baseItemsObject,
        };
    }
    createAndReturnNewContainerDom(animationObject) {
        const animatorContainer = $(document.createElement('div'));
        animatorContainer.addClass([
            CoreAnimator.PREFIX,
            'container',
            Math.round(performance.now()).toString(),
        ]);
        if (animationObject
            .items
            ?.invert === true) {
            animatorContainer.addClass('invert');
        }
        CoreAnimator.activate(animatorContainer);
        this.ctx.animatorContainersWrapper.appendChild(animatorContainer);
        this.ctx.animatorContainers.push(animatorContainer);
        return animatorContainer;
    }
}

class LottieFactory {
    ctx;
    constructor(thisArg) {
        this.ctx = thisArg;
    }
    async create(animationObject) {
        const lottie = await import('./lottie-da260d24.js').then(function (n) { return n.l; });
        if (animationObject.items.__container == null) {
            throw new UnexpectedValueError('`__container` is nullish');
        }
        const className = animationObject.items.uid;
        const animation = lottie.loadAnimation({
            container: animationObject.items.__container,
            renderer: 'canvas',
            loop: true,
            autoplay: true,
            animationData: animationObject.data,
            rendererSettings: {
                dpr: animationObject.items.respectDevicePixelRatio === false
                    ? 1
                    : this.ctx.dpr * this.ctx.resolutionMultiplier,
                preserveAspectRatio: 'xMidYMid slice',
                className: `${CoreAnimator.PREFIX} ${className} hidden`,
            },
        });
        if (!animation) {
            await new Promise((resolve) => $(animation).on('DOMLoaded', () => resolve));
        }
        const domContent = $(`.${className}`);
        const totalFrames = (animationObject.items.totalFrames
            || animation.getDuration(true));
        const onFrame = (animationItem, frame) => {
            animationItem
                .items
                .object
                ?.lottie
                ?.animation
                .goToAndStop(frame, true);
        };
        const lottieObject = {
            animation,
            totalFrames,
            domContent,
            onFrame,
        };
        lottieObject.animation.goToAndStop(-1, true);
        this.onLottieObjectCreated(lottieObject);
        return lottieObject;
    }
    // eslint-disable-next-line class-methods-use-this
    onLottieObjectCreated(lottieObject) {
        const lottieObjectDom = lottieObject.domContent;
        lottieObjectDom.css({
            width: '',
            height: '',
            position: 'absolute',
        });
        lottieObjectDom.width = 1;
        lottieObjectDom.height = 1;
    }
}

class SolidFactory {
    ctx;
    constructor(thisArg) {
        this.ctx = thisArg;
    }
    async create(animationObject) {
        const { uid, __container, } = animationObject.items;
        const className = uid;
        const domContent = this.createAndReturnDomContent(className);
        __container?.appendChild(domContent);
        const solidObject = {
            domContent,
        };
        return solidObject;
    }
    // eslint-disable-next-line class-methods-use-this
    createAndReturnDomContent(className) {
        const domContent = $(document.createElement('div'));
        domContent.css({
            width: '100vw',
            height: '100vh',
            background: 'white',
            position: 'absolute',
        });
        domContent.addClass([
            CoreAnimator.PREFIX,
            'solid',
            className,
            'hidden',
        ]);
        return domContent;
    }
}

class CoreAnimator {
    static PREFIX = '__animate';
    mWindowUtility = new WindowUtility();
    uid = Math.round(performance.now()).toString();
    currentFrame = 0;
    totalFrames = 0;
    animations = [];
    metaAnimations = [];
    animatorContainers = [];
    __animatorContainersWrapper = null;
    visibleAnimations = [];
    dpr = Math.max(window.devicePixelRatio / 2, 1);
    resolutionMultiplier = 1;
    rafId = null;
    maxAttributeCache = {};
    minAttributeCache = {};
    lottieInstance;
    constructor() {
        $(window).on('load resize', () => window.requestAnimationFrame(() => {
            this.onWindowResize.call(this);
            if (this.visibleAnimations !== null) {
                this.visibleAnimations.forEach((animation) => {
                    animation.items.onRedraw?.call(this, animation);
                });
            }
        }));
    }
    get animatorContainersWrapper() {
        if (this.__animatorContainersWrapper) {
            return this.__animatorContainersWrapper;
        }
        this.__animatorContainersWrapper = $(document.createElement('div'));
        this.__animatorContainersWrapper.addClass([
            CoreAnimator.PREFIX,
            'containersWrapper',
            this.uid,
            'height',
        ]);
        CoreAnimator.activate(this.__animatorContainersWrapper);
        $('.painting').appendChild(this.__animatorContainersWrapper);
        return this.__animatorContainersWrapper;
    }
    async add(animationToBeConstructed) {
        const mAnimationFactory = new AnimationFactory(this);
        const animationObject = mAnimationFactory.create(animationToBeConstructed);
        const { type, index, items, } = animationObject;
        let lottieObject = null;
        let solidObject = null;
        switch (type) {
            case 'null':
                break;
            case 'meta':
                break;
            case 'solid':
                solidObject = await (new SolidFactory(this)).create(animationObject);
                animationObject.items = {
                    ...items,
                    domContent: solidObject.domContent,
                };
                break;
            case 'lottie':
                if (this.lottieInstance == null) {
                    this.lottieInstance = await import('./lottie-da260d24.js').then(function (n) { return n.l; });
                }
                lottieObject = await (new LottieFactory(this)).create(animationObject);
                animationObject.items = {
                    ...items,
                    totalFrames: lottieObject.totalFrames,
                    domContent: lottieObject.domContent,
                    onFrame: (animationItem, frame) => {
                        lottieObject?.onFrame?.(animationItem, frame);
                        items.onFrame(animationItem, frame);
                    },
                    onRedraw: (animationItem) => {
                        this.onRedraw(animationItem);
                        items.onRedraw(animationItem);
                    },
                    object: {
                        lottie: lottieObject,
                    },
                };
                break;
            default:
        }
        switch (true) {
            case type === 'meta':
                this.metaAnimations.push(animationObject);
                break;
            case index === null:
                // add to the end of the array
                this.animations.push([animationObject]);
                break;
            case this.animations[index] === undefined:
                // add a nested array to the index
                this.animations[index] = [animationObject];
                break;
            case this.animations[index].constructor === Array:
                // add to the nested array at the index
                this.animations[index].push(animationObject);
                break;
            default:
        }
        // add up the 'totalFrames' of every animation
        this.totalFrames = this.getMaxAttributeFromAnimationsItems('totalFrames', this.animations)
            .reduce((accumulator, currentValue) => currentValue + accumulator, 0);
        this.onAdd(animationObject);
        return animationObject;
    }
    onAdd(animation) {
        this.onNewAnimation(animation);
        // to be overriden
    }
    getRelativeFrame(frame) {
        return frame * this.totalFrames;
    }
    async rawAnimate(items, callback) {
        const { from, to, options: { fps = 120, speed = 1, } = {}, } = items;
        const inverted = to < from;
        const processedFrom = inverted ? to : from;
        const processedTo = inverted ? from : to;
        if (items.options === undefined) {
            return this.rawAnimate({
                from: processedFrom,
                to: processedTo,
                options: {},
            }, callback);
        }
        if (processedFrom === processedTo) {
            callback(processedTo);
            return new Promise((resolve) => resolve());
        }
        if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId);
        }
        return new Promise((resolve) => {
            let i = processedFrom;
            const step = () => {
                callback(inverted ? processedTo - i : i);
                if (i >= processedTo) {
                    resolve();
                    return;
                }
                i += (1 * speed) * (fps / 60);
                this.rafId = window.requestAnimationFrame(step);
            };
            this.rafId = window.requestAnimationFrame(step);
        });
    }
    onNewAnimation(animation) {
        const { onRedraw, domContent, } = animation.items;
        if (domContent !== null) {
            CoreAnimator.hide(domContent);
        }
        onRedraw(animation);
        this.onWindowResize();
        this.visibleAnimations = null;
        this.onFrame(this.currentFrame);
    }
    onWindowResize() {
        if (this.animatorContainers.length < 1) {
            return;
        }
        const viewportHeight = WindowUtility.viewport.height;
        const innerHeight = WindowUtility.inner.height;
        if (viewportHeight === innerHeight) {
            this.animatorContainersWrapper.removeClass('innerCenter');
        }
        else {
            this.animatorContainersWrapper.addClass('innerCenter');
        }
        this.animatorContainers.fastEach((animatorContainer, i) => {
            if (!(this.animations?.[i])) {
                return;
            }
            this.animations.fastEach((workingAnimations) => {
                workingAnimations.fastEach((workingAnimation) => {
                    const { __container, width, height, } = workingAnimation.items;
                    if (!__container) {
                        return;
                    }
                    let workingWidth = null;
                    let workingHeight = null;
                    workingWidth = getValueWithinRange({
                        minimum: width.minimum,
                        maximum: width.maximum,
                        value: WindowUtility.inner.width,
                    });
                    workingHeight = getValueWithinRange({
                        minimum: height.minimum,
                        maximum: height.maximum,
                        value: WindowUtility.inner.height,
                    });
                    __container.css('width', workingWidth == null
                        ? ''
                        : workingWidth);
                    __container.css('height', workingHeight === null
                        ? ''
                        : workingHeight);
                });
            });
        });
        // attempt to resize if it exists
        this.lottieInstance?.resize?.();
        function getValueWithinRange({ minimum, maximum, value, }) {
            if (minimum === null
                || maximum === null) {
                return null;
            }
            let workingAttributeValue = null;
            if (maximum) {
                workingAttributeValue = Math.min(value, maximum);
            }
            if (minimum) {
                workingAttributeValue = Math.max(value, minimum);
            }
            return workingAttributeValue;
        }
    }
    onRedraw(animation) {
        const { respectDevicePixelRatio, object, domContent, } = animation.items;
        if (!object.lottie) {
            return;
        }
        const lottieObjectDom = domContent;
        if (lottieObjectDom == null) {
            throw new UnexpectedValueError('lottieObjectDom is nullish');
        }
        if (respectDevicePixelRatio !== false) {
            const lottieObjectContainersWrapperWidth = this.animatorContainersWrapper.clientWidth;
            const lottieObjectContainersWrapperHeight = this.animatorContainersWrapper.clientHeight;
            const lottieObjectWidth = parseFloat(lottieObjectDom.css('width', { computed: true })) / this.resolutionMultiplier;
            const lottieObjectHeight = parseFloat(lottieObjectDom.css('height', { computed: true })) / this.resolutionMultiplier;
            const offsetWidth = -(lottieObjectWidth - lottieObjectContainersWrapperWidth) / 2;
            const offsetHeight = -(lottieObjectHeight - lottieObjectContainersWrapperHeight) / 2;
            lottieObjectDom.css({
                transform: `translate(${offsetWidth}px, ${offsetHeight}px) scale(${1 / this.resolutionMultiplier})`,
            });
        }
    }
    onFrame(frame) {
        if (!(this.animations.length > 0)) {
            return;
        }
        let animationIndex = null;
        let currentAnimationsTotalFrames = null;
        let workingAnimations = [];
        const uids = [];
        // TODO: optimize below code, use caching or something
        if (frame <= 0) {
            animationIndex = -1;
            currentAnimationsTotalFrames = 0;
            workingAnimations = this.animations[-1];
        }
        else {
            // get an array of the 'totalFrames' of every animation,
            // and then find the total frames and the index of the current animation
            const animationTotalFrames = this.getMaxAttributeFromAnimationsItems('totalFrames', this.animations);
            animationTotalFrames.reduce((accumulated, currentValue, i) => {
                const accumulating = currentValue + accumulated;
                // if the current accumulated value is more than the frame,
                // it means that we've overshot and the previous index is the current animation
                if (accumulating > frame
                    // if i is the last index in the array,
                    // we cut straight to it so it won't overshoot again and surpass this.animations
                    // because the accumulating amount won't exeed the frame
                    || i === animationTotalFrames.length - 1) {
                    if (animationIndex === null) {
                        animationIndex = i;
                        currentAnimationsTotalFrames = currentValue + accumulated;
                    }
                    return 0;
                }
                // not there yet, continue accumulating
                return accumulating;
            }, 0);
            workingAnimations = this.animations[animationIndex];
        }
        if (!workingAnimations) {
            return;
        }
        if (currentAnimationsTotalFrames == null) {
            throw new UnexpectedValueError('currentAnimationsTotalFrames is nullish');
        }
        const maxOffset = Math.max(...this.getMaxAttributeFromAnimationsItems('offset', [workingAnimations]));
        const minOffset = Math.min(...this.getMinAttributeFromAnimationsItems('offset', [workingAnimations]));
        workingAnimations.fastEach((workingAnimation) => {
            const { __caller, __framesBeforeCurrent, uid, totalFrames, onFrame, offset, bezier, } = workingAnimation.items;
            if (totalFrames == null) {
                return;
            }
            // slightly faster sometimes than Array.push() https://jsben.ch/gO5B7
            uids[uids.length] = uid;
            const mBezierUtility = new BezierUtility(bezier[0], bezier[1], bezier[2], bezier[3]);
            const globalFrame = frame;
            // todo: add support for mixing -ve and +ve offsets in one instance
            let localFrame = mBezierUtility.at(Math.max(Math.min((((globalFrame
                - __framesBeforeCurrent) + offset)
                / ((currentAnimationsTotalFrames
                    - __framesBeforeCurrent
                // conditions below are for support of negative offsets
                ) - (maxOffset || Math.abs(minOffset)) + (maxOffset && offset))), 1), 0))
                * totalFrames;
            localFrame = Number.isNaN(localFrame) ? totalFrames : localFrame;
            if (window.DEBUG === true
                && __caller.name !== 'FrameAnimator') {
                console.log('frame', frame);
                console.log('__caller', __caller.name);
                console.log('workingAnimation', workingAnimation);
                console.log('globalFrame', globalFrame);
                console.log('animationIndex', animationIndex);
                console.log('localFrame', localFrame);
                console.log('currentAnimationsTotalFrames', currentAnimationsTotalFrames);
                console.log('this.visibleAnimations', this.visibleAnimations);
                console.log('this.animations', this.animations);
                console.log('this.totalFrames', this.totalFrames);
                console.log('');
            }
            this.currentFrame = frame;
            this.onVisibleAnimationsChange(workingAnimations);
            onFrame(workingAnimation, localFrame);
        });
        this.metaAnimations.fastEach((metaAnimation) => {
            const { onFrame, } = metaAnimation.items;
            const __framesBeforeCurrent = this.getTotalFramesBeforeIndex(animationIndex) ?? 0;
            const mAnimationFactory = new AnimationFactory(this);
            const animation = mAnimationFactory.create({
                type: 'meta',
                index: animationIndex,
                items: {
                    uid: uids.join(' '),
                    totalFrames: currentAnimationsTotalFrames
                        // todo: is probably a bug
                        - __framesBeforeCurrent,
                },
            });
            onFrame(animation, frame - __framesBeforeCurrent);
        });
    }
    getMaxAttributeFromAnimationsItems(attributeKey, animations) {
        if (this.maxAttributeCache[attributeKey]) {
            return this.maxAttributeCache[attributeKey];
        }
        return animations.map((animation) => Math.max(...animation.map((workingAnimation) => (
        // @ts-expect-error obj[string]
        workingAnimation.items[attributeKey]))));
    }
    getMinAttributeFromAnimationsItems(attributeKey, animations) {
        if (this.minAttributeCache[attributeKey]) {
            return this.minAttributeCache[attributeKey];
        }
        return animations.map((animation) => Math.min(...animation.map((workingAnimation) => (
        // @ts-expect-error obj[string]
        workingAnimation.items[attributeKey]))));
    }
    getTotalFramesBeforeIndex(index) {
        const totalFrames = this.getMaxAttributeFromAnimationsItems('totalFrames', this.animations);
        let previousFrames = null;
        totalFrames.reduce((accumulator, currentValue, i) => {
            if (i >= index) {
                if (previousFrames === null) {
                    previousFrames = accumulator;
                }
                return 0;
            }
            if (i + 1 === index) {
                previousFrames = currentValue + accumulator;
            }
            // not there yet, continue accumulating
            return currentValue + accumulator;
        }, 0);
        return previousFrames;
    }
    onVisibleAnimationsChange(animations) {
        if (this.visibleAnimations === animations) {
            return;
        }
        animations.forEach((animation) => {
            const { onVisible, onRedraw, domContent, } = animation.items;
            onVisible(animation);
            onRedraw(animation);
            if (domContent === null) {
                return;
            }
            CoreAnimator.unhide(domContent);
        });
        if (this.visibleAnimations === null) {
            this.visibleAnimations = animations;
            return;
        }
        if (this.visibleAnimations === animations) {
            return;
        }
        this.visibleAnimations.forEach((visibleAnimation) => {
            const { onHidden, domContent, } = visibleAnimation.items;
            onHidden(visibleAnimation);
            if (domContent === null) {
                return;
            }
            CoreAnimator.hide(domContent);
        });
        this.visibleAnimations = animations;
    }
    seekToUid(targetUid) {
        const handler = (workingAnimations, i) => {
            workingAnimations.fastEach((workingAnimation) => {
                const { uid, } = workingAnimation.items;
                if (uid !== targetUid) {
                    return;
                }
                const frame = this.getTotalFramesBeforeIndex(i + 1) ?? 0;
                this.onSeek(Math.max(frame - 1, 0));
            });
        };
        if (this.animations[-1]) {
            handler(this.animations[-1], -1);
        }
        this.animations.fastEach(handler);
    }
    seekTo(frame) {
        this.onSeek(frame);
        this.onFrame(frame);
    }
    onSeek(frame) {
        this.onFrame(frame);
        // to be overriden
    }
    static hide(domElement) {
        return $(domElement).addClass('hidden');
    }
    static unhide(domElement) {
        return $(domElement).removeClass('hidden');
    }
    static activate(domElement) {
        return $(domElement).addClass('active');
    }
    static deactivate(domElement) {
        return $(domElement).removeClass('active');
    }
}

class FrameAnimator extends CoreAnimator {
    async animate(from, to, options = {}) {
        return this.rawAnimate({
            from,
            to,
            options,
        }, (frame) => {
            super.onFrame(frame);
        });
    }
    async repeat(from, to, options = {}) {
        for (;;) {
            await this.animate(from, to, options);
        }
    }
    cancelNextFrame() {
        if (this.rafId == null) {
            return;
        }
        cancelAnimationFrame(this.rafId);
    }
}

class ScrollAnimator extends CoreAnimator {
    nextOnScrollCancelled = false;
    responsibleForLastResize = false;
    constructor() {
        super();
        $(window).on('scroll', () => window.requestAnimationFrame(() => this.onScroll.call(this)));
    }
    // @Override
    async add(animationToBeConstructed) {
        const result = await super.add(animationToBeConstructed);
        this.onWindowResize();
        this.onScroll();
        return result;
    }
    // @Override
    onWindowResize() {
        super.onWindowResize();
        const windowHeight = WindowUtility.viewport.height;
        const documentHeight = windowHeight * (this.animations.length + 1);
        if (!(documentHeight > (Number.parseInt($(document.body).css('height'), 10) || 0)
            || this.responsibleForLastResize)) {
            this.responsibleForLastResize = false;
            return;
        }
        this.responsibleForLastResize = true;
        $(document.body).css({
            height: documentHeight,
        });
    }
    // @Override
    onSeek(frame) {
        const yOffset = Math.max(Math.ceil((frame / this.totalFrames)
            * (document.body.offsetHeight - WindowUtility.viewport.height)) + 7, 0);
        this.scrollTo({
            left: 0,
            top: yOffset,
            behavior: 'smooth',
        }, () => {
            this.onFrame(frame);
        });
    }
    // @Override
    seekTo(scrollPosition) {
        this.scrollTo({
            left: 0,
            top: scrollPosition,
            behavior: 'smooth',
        }, () => {
            this.onFrame(scrollPosition);
        });
    }
    scrollTo(scrollOptions, callback) {
        const { top = 0, left = 0, behavior, } = scrollOptions;
        const onScroll = () => {
            // floor both values as some browsers support decimals while some don't
            if (Math.floor(window.pageYOffset) === Math.floor(top)
                && Math.floor(window.pageXOffset) === Math.floor(left)) {
                this.nextOnScrollCancelled = true;
                window.removeEventListener('scroll', onScroll);
                if (!callback) {
                    return;
                }
                callback();
            }
        };
        window.addEventListener('scroll', onScroll);
        onScroll();
        window.scrollTo({
            top,
            behavior,
        });
    }
    onScroll() {
        if (this.nextOnScrollCancelled) {
            this.nextOnScrollCancelled = false;
            return;
        }
        const { scrollY } = window;
        const globalFrame = this.getRelativeFrame(scrollY / (Math.min(document.body.scrollHeight, WindowUtility.viewport.height * (this.animations.length + 1))
            - WindowUtility.viewport.height));
        this.onFrame(globalFrame);
    }
}

var undefined$9 = undefined;

/* src\ui\blocks\Hamburger2.svelte generated by Svelte v3.38.2 */

const { Object: Object_1 } = globals;
const file$8 = "src\\ui\\blocks\\Hamburger2.svelte";

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[27] = list[i][0];
	child_ctx[28] = list[i][1];
	child_ctx[29] = list;
	child_ctx[30] = i;
	return child_ctx;
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[31] = list[i];
	return child_ctx;
}

function get_each_context_2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[34] = list[i];
	return child_ctx;
}

// (253:0) {#if toppings}
function create_if_block$2(ctx) {
	let component;
	let container0;
	let lottietogglebutton;
	let updating_isActiveW;
	let t0;
	let container1;
	let t1;
	let container2;
	let t2;
	let container3;
	let t3;
	let container4;
	let t4;
	let container8;
	let container7;
	let container5;
	let t5;
	let t6;
	let container6;
	let current;

	function lottietogglebutton_isActiveW_binding(value) {
		/*lottietogglebutton_isActiveW_binding*/ ctx[17](value);
	}

	let lottietogglebutton_props = {
		animationData: hamburger,
		overrideColour: "--colour-text-primary"
	};

	if (/*isActiveW*/ ctx[0] !== void 0) {
		lottietogglebutton_props.isActiveW = /*isActiveW*/ ctx[0];
	}

	lottietogglebutton = new LottieToggleButton({
			props: lottietogglebutton_props,
			$$inline: true
		});

	/*lottietogglebutton_binding*/ ctx[16](lottietogglebutton);
	binding_callbacks.push(() => bind(lottietogglebutton, "isActiveW", lottietogglebutton_isActiveW_binding));
	let each_value = Object.entries(/*toppings*/ ctx[1]);
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	const block = {
		c: function create() {
			component = element("component");
			container0 = element("container");
			create_component(lottietogglebutton.$$.fragment);
			t0 = space();
			container1 = element("container");
			t1 = space();
			container2 = element("container");
			t2 = space();
			container3 = element("container");
			t3 = space();
			container4 = element("container");
			t4 = space();
			container8 = element("container");
			container7 = element("container");
			container5 = element("container");
			t5 = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t6 = space();
			container6 = element("container");
			attr_dev(container0, "class", "button svelte-e2u7o5");
			set_style(container0, "--button-size", CSSUtility.parse(/*buttonSize*/ ctx[2]));
			toggle_class(container0, "boosted", /*$isActiveW*/ ctx[7]);
			add_location(container0, file$8, 258, 2, 9744);
			attr_dev(container1, "class", "overlay y top svelte-e2u7o5");
			toggle_class(container1, "active", /*$isActiveW*/ ctx[7]);
			add_location(container1, file$8, 272, 2, 10061);
			attr_dev(container2, "class", "overlay y bottom svelte-e2u7o5");
			toggle_class(container2, "active", /*$isActiveW*/ ctx[7]);
			add_location(container2, file$8, 276, 2, 10137);
			attr_dev(container3, "class", "overlay x left svelte-e2u7o5");
			toggle_class(container3, "active", /*$isActiveW*/ ctx[7]);
			add_location(container3, file$8, 280, 2, 10216);
			attr_dev(container4, "class", "overlay x right svelte-e2u7o5");
			toggle_class(container4, "active", /*$isActiveW*/ ctx[7]);
			add_location(container4, file$8, 284, 2, 10293);
			add_location(container5, file$8, 298, 3, 10605);
			add_location(container6, file$8, 374, 4, 12236);
			attr_dev(container7, "class", "toppings svelte-e2u7o5");
			set_style(container7, "--grid-template-rows", "auto repeat(" + Object.keys(/*toppingsAnimators*/ ctx[12]).length + ", min-content) auto");
			toggle_class(container7, "active", /*$isActiveW*/ ctx[7]);
			add_location(container7, file$8, 291, 3, 10411);
			attr_dev(container8, "class", "wrapper svelte-e2u7o5");
			add_location(container8, file$8, 288, 2, 10371);
			set_style(component, "--colour-background", CSSUtility.parse(/*backgroundColour*/ ctx[3]));
			attr_dev(component, "class", "svelte-e2u7o5");
			add_location(component, file$8, 253, 1, 9647);
		},
		m: function mount(target, anchor) {
			insert_dev(target, component, anchor);
			append_dev(component, container0);
			mount_component(lottietogglebutton, container0, null);
			append_dev(component, t0);
			append_dev(component, container1);
			append_dev(component, t1);
			append_dev(component, container2);
			append_dev(component, t2);
			append_dev(component, container3);
			append_dev(component, t3);
			append_dev(component, container4);
			append_dev(component, t4);
			append_dev(component, container8);
			append_dev(container8, container7);
			append_dev(container7, container5);
			append_dev(container7, t5);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(container7, null);
			}

			append_dev(container7, t6);
			append_dev(container7, container6);
			current = true;
		},
		p: function update(ctx, dirty) {
			const lottietogglebutton_changes = {};

			if (!updating_isActiveW && dirty[0] & /*isActiveW*/ 1) {
				updating_isActiveW = true;
				lottietogglebutton_changes.isActiveW = /*isActiveW*/ ctx[0];
				add_flush_callback(() => updating_isActiveW = false);
			}

			lottietogglebutton.$set(lottietogglebutton_changes);

			if (!current || dirty[0] & /*buttonSize*/ 4) {
				set_style(container0, "--button-size", CSSUtility.parse(/*buttonSize*/ ctx[2]));
			}

			if (dirty[0] & /*$isActiveW*/ 128) {
				toggle_class(container0, "boosted", /*$isActiveW*/ ctx[7]);
			}

			if (dirty[0] & /*$isActiveW*/ 128) {
				toggle_class(container1, "active", /*$isActiveW*/ ctx[7]);
			}

			if (dirty[0] & /*$isActiveW*/ 128) {
				toggle_class(container2, "active", /*$isActiveW*/ ctx[7]);
			}

			if (dirty[0] & /*$isActiveW*/ 128) {
				toggle_class(container3, "active", /*$isActiveW*/ ctx[7]);
			}

			if (dirty[0] & /*$isActiveW*/ 128) {
				toggle_class(container4, "active", /*$isActiveW*/ ctx[7]);
			}

			if (dirty[0] & /*toppingContainers, toppings, isActiveW, currentOnMouseChildDom, animateToppingHover, $rippleItems, toppingTitles, suffix, prefix*/ 20083) {
				each_value = Object.entries(/*toppings*/ ctx[1]);
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(container7, t6);
					}
				}

				group_outros();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}

			if (dirty[0] & /*$isActiveW*/ 128) {
				toggle_class(container7, "active", /*$isActiveW*/ ctx[7]);
			}

			if (!current || dirty[0] & /*backgroundColour*/ 8) {
				set_style(component, "--colour-background", CSSUtility.parse(/*backgroundColour*/ ctx[3]));
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(lottietogglebutton.$$.fragment, local);

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o: function outro(local) {
			transition_out(lottietogglebutton.$$.fragment, local);
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(component);
			/*lottietogglebutton_binding*/ ctx[16](null);
			destroy_component(lottietogglebutton);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$2.name,
		type: "if",
		source: "(253:0) {#if toppings}",
		ctx
	});

	return block;
}

// (332:7) {#if prefix}
function create_if_block_3(ctx) {
	let span;
	let t;

	const block = {
		c: function create() {
			span = element("span");
			t = text(/*prefix*/ ctx[4]);
			attr_dev(span, "class", "prefix svelte-e2u7o5");
			add_location(span, file$8, 332, 8, 11398);
		},
		m: function mount(target, anchor) {
			insert_dev(target, span, anchor);
			append_dev(span, t);
		},
		p: function update(ctx, dirty) {
			if (dirty[0] & /*prefix*/ 16) set_data_dev(t, /*prefix*/ ctx[4]);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(span);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_3.name,
		type: "if",
		source: "(332:7) {#if prefix}",
		ctx
	});

	return block;
}

// (339:7) {#each key.split('') as char}
function create_each_block_2(ctx) {
	let span;
	let t_value = (/*char*/ ctx[34] === " " ? " " : /*char*/ ctx[34]) + "";
	let t;

	const block = {
		c: function create() {
			span = element("span");
			t = text(t_value);
			attr_dev(span, "class", "char svelte-e2u7o5");
			add_location(span, file$8, 339, 8, 11537);
		},
		m: function mount(target, anchor) {
			insert_dev(target, span, anchor);
			append_dev(span, t);
		},
		p: function update(ctx, dirty) {
			if (dirty[0] & /*toppings*/ 2 && t_value !== (t_value = (/*char*/ ctx[34] === " " ? " " : /*char*/ ctx[34]) + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(span);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_2.name,
		type: "each",
		source: "(339:7) {#each key.split('') as char}",
		ctx
	});

	return block;
}

// (350:7) {#if suffix}
function create_if_block_2(ctx) {
	let span;
	let t;

	const block = {
		c: function create() {
			span = element("span");
			t = text(/*suffix*/ ctx[5]);
			attr_dev(span, "class", "suffix svelte-e2u7o5");
			add_location(span, file$8, 350, 8, 11726);
		},
		m: function mount(target, anchor) {
			insert_dev(target, span, anchor);
			append_dev(span, t);
		},
		p: function update(ctx, dirty) {
			if (dirty[0] & /*suffix*/ 32) set_data_dev(t, /*suffix*/ ctx[5]);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(span);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2.name,
		type: "if",
		source: "(350:7) {#if suffix}",
		ctx
	});

	return block;
}

// (360:8) {#if ripple.key === key}
function create_if_block_1$1(ctx) {
	let ripple;
	let current;

	ripple = new Ripple({
			props: {
				x: /*ripple*/ ctx[31].x,
				y: /*ripple*/ ctx[31].y,
				size: /*ripple*/ ctx[31].size,
				speed: 250,
				sizeIn: 20,
				opacityIn: 0.2,
				fill: "--colour-accent-primary"
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(ripple.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(ripple, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const ripple_changes = {};
			if (dirty[0] & /*$rippleItems*/ 2048) ripple_changes.x = /*ripple*/ ctx[31].x;
			if (dirty[0] & /*$rippleItems*/ 2048) ripple_changes.y = /*ripple*/ ctx[31].y;
			if (dirty[0] & /*$rippleItems*/ 2048) ripple_changes.size = /*ripple*/ ctx[31].size;
			ripple.$set(ripple_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(ripple.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(ripple.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(ripple, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$1.name,
		type: "if",
		source: "(360:8) {#if ripple.key === key}",
		ctx
	});

	return block;
}

// (359:7) {#each $rippleItems as ripple}
function create_each_block_1(ctx) {
	let if_block_anchor;
	let current;
	let if_block = /*ripple*/ ctx[31].key === /*key*/ ctx[27] && create_if_block_1$1(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			if (/*ripple*/ ctx[31].key === /*key*/ ctx[27]) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty[0] & /*$rippleItems, toppings*/ 2050) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block_1$1(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_1.name,
		type: "each",
		source: "(359:7) {#each $rippleItems as ripple}",
		ctx
	});

	return block;
}

// (300:4) {#each Object.entries(toppings) as [key, value], i}
function create_each_block(ctx) {
	let container;
	let string;
	let t0;
	let t1;
	let key = /*key*/ ctx[27];
	let t2;
	let svg;
	let current;
	let mounted;
	let dispose;
	let if_block0 = /*prefix*/ ctx[4] && create_if_block_3(ctx);
	let each_value_2 = /*key*/ ctx[27].split("");
	validate_each_argument(each_value_2);
	let each_blocks_1 = [];

	for (let i = 0; i < each_value_2.length; i += 1) {
		each_blocks_1[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
	}

	let if_block1 = /*suffix*/ ctx[5] && create_if_block_2(ctx);
	const assign_string = () => /*string_binding*/ ctx[18](string, key);
	const unassign_string = () => /*string_binding*/ ctx[18](null, key);
	let each_value_1 = /*$rippleItems*/ ctx[11];
	validate_each_argument(each_value_1);
	let each_blocks = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	function click_handler() {
		return /*click_handler*/ ctx[19](/*value*/ ctx[28]);
	}

	function mouseover_handler(...args) {
		return /*mouseover_handler*/ ctx[20](/*key*/ ctx[27], ...args);
	}

	function mouseout_handler(...args) {
		return /*mouseout_handler*/ ctx[21](/*key*/ ctx[27], ...args);
	}

	const assign_container = () => /*container_binding*/ ctx[22](container, key);
	const unassign_container = () => /*container_binding*/ ctx[22](null, key);

	const block = {
		c: function create() {
			container = element("container");
			string = element("string");
			if (if_block0) if_block0.c();
			t0 = space();

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].c();
			}

			t1 = space();
			if (if_block1) if_block1.c();
			t2 = space();
			svg = svg_element("svg");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(string, "class", "svelte-e2u7o5");
			add_location(string, file$8, 328, 6, 11312);
			attr_dev(svg, "class", "svelte-e2u7o5");
			add_location(svg, file$8, 357, 6, 11842);
			attr_dev(container, "class", "topping svelte-e2u7o5");
			set_style(container, "--grid-row", /*i*/ ctx[30] + 2 + " / " + (/*i*/ ctx[30] + 3));
			set_style(container, "--grid-column", "2 / 3");
			add_location(container, file$8, 300, 5, 10682);
		},
		m: function mount(target, anchor) {
			insert_dev(target, container, anchor);
			append_dev(container, string);
			if (if_block0) if_block0.m(string, null);
			append_dev(string, t0);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].m(string, null);
			}

			append_dev(string, t1);
			if (if_block1) if_block1.m(string, null);
			assign_string();
			append_dev(container, t2);
			append_dev(container, svg);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(svg, null);
			}

			assign_container();
			current = true;

			if (!mounted) {
				dispose = [
					listen_dev(container, "click", click_handler, false, false, false),
					listen_dev(container, "mouseover", mouseover_handler, false, false, false),
					listen_dev(container, "mouseout", mouseout_handler, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;

			if (/*prefix*/ ctx[4]) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_3(ctx);
					if_block0.c();
					if_block0.m(string, t0);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (dirty[0] & /*toppings*/ 2) {
				each_value_2 = /*key*/ ctx[27].split("");
				validate_each_argument(each_value_2);
				let i;

				for (i = 0; i < each_value_2.length; i += 1) {
					const child_ctx = get_each_context_2(ctx, each_value_2, i);

					if (each_blocks_1[i]) {
						each_blocks_1[i].p(child_ctx, dirty);
					} else {
						each_blocks_1[i] = create_each_block_2(child_ctx);
						each_blocks_1[i].c();
						each_blocks_1[i].m(string, t1);
					}
				}

				for (; i < each_blocks_1.length; i += 1) {
					each_blocks_1[i].d(1);
				}

				each_blocks_1.length = each_value_2.length;
			}

			if (/*suffix*/ ctx[5]) {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = create_if_block_2(ctx);
					if_block1.c();
					if_block1.m(string, null);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}

			if (key !== /*key*/ ctx[27]) {
				unassign_string();
				key = /*key*/ ctx[27];
				assign_string();
			}

			if (dirty[0] & /*$rippleItems, toppings*/ 2050) {
				each_value_1 = /*$rippleItems*/ ctx[11];
				validate_each_argument(each_value_1);
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1(ctx, each_value_1, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block_1(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(svg, null);
					}
				}

				group_outros();

				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}

			if (key !== /*key*/ ctx[27]) {
				unassign_container();
				key = /*key*/ ctx[27];
				assign_container();
			}
		},
		i: function intro(local) {
			if (current) return;

			for (let i = 0; i < each_value_1.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o: function outro(local) {
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(container);
			if (if_block0) if_block0.d();
			destroy_each(each_blocks_1, detaching);
			if (if_block1) if_block1.d();
			unassign_string();
			destroy_each(each_blocks, detaching);
			unassign_container();
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block.name,
		type: "each",
		source: "(300:4) {#each Object.entries(toppings) as [key, value], i}",
		ctx
	});

	return block;
}

function create_fragment$8(ctx) {
	let if_block_anchor;
	let current;
	let if_block = /*toppings*/ ctx[1] && create_if_block$2(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			if (/*toppings*/ ctx[1]) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty[0] & /*toppings*/ 2) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block$2(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$8.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$8($$self, $$props, $$invalidate) {
	let $isActiveW,
		$$unsubscribe_isActiveW = noop$1,
		$$subscribe_isActiveW = () => ($$unsubscribe_isActiveW(), $$unsubscribe_isActiveW = subscribe(isActiveW, $$value => $$invalidate(7, $isActiveW = $$value)), isActiveW);

	let $rippleItems;
	$$self.$$.on_destroy.push(() => $$unsubscribe_isActiveW());
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("Hamburger2", slots, []);
	let { isActiveW = writable(false) } = $$props;
	validate_store(isActiveW, "isActiveW");
	$$subscribe_isActiveW();
	let { toppings } = $$props;
	let { buttonSize = "2rem" } = $$props;
	let { backgroundColour = "--colour-background-primary" } = $$props;
	let { prefix = "—  " } = $$props;
	let { suffix = "" } = $$props;
	let { totalFrames = 120 } = $$props;
	let lottieToggleButton;
	let currentOnMouseChildDom;
	const toppingTitles = {};
	const toppingContainers = {};

	const toppingsAnimators = (() => {
		const result = {};

		Object.keys(toppings).forEach(toppingsKey => {
			result[toppingsKey] = {
				revealFrameAnimator: new FrameAnimator(),
				hoverFrameAnimator: new FrameAnimator()
			};
		});

		return result;
	})();

	const rippleItems = (() => {
		const arrayW = writable([]);

		return Object.assign(Object.assign({}, arrayW), {
			add: item => arrayW.update(items => [...items, item]),
			clear: () => arrayW.update(() => [])
		});
	})();

	validate_store(rippleItems, "rippleItems");
	component_subscribe($$self, rippleItems, value => $$invalidate(11, $rippleItems = value));

	onMount(() => {
		window.addEventListener("popstate", onPopState);
		window.addEventListener("mousedown", onMouseDown);
		createAnimations();
	});

	onDestroy(() => {
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("mousedown", onMouseDown);
	});

	function onMouseDown(event) {
		var _a, _b;
		const { target } = event;
		const indexOfTarget = Object.values(toppingContainers).indexOf(target);

		if (target == null || indexOfTarget === -1) {
			return;
		}

		const { x, y } = target.getBoundingClientRect();

		rippleItems.add({
			key: Object.keys(toppingContainers)[indexOfTarget],
			x: ((_a = event) !== null && _a !== void 0
			? _a
			: event.touches[0]).pageX - x,
			y: ((_b = event) !== null && _b !== void 0
			? _b
			: event.touches[0]).pageY - y,
			size: target.clientWidth
		});
	}

	function onPopState() {
		isActiveW.set(false);
	}

	function createAnimations() {
		const toppingsAnimatorsEntries = Object.entries(toppingsAnimators);

		toppingsAnimatorsEntries.forEach(([toppingsAnimatorsKey, toppingsAnimator], i) => {
			const { revealFrameAnimator, hoverFrameAnimator } = toppingsAnimator;
			const title = toppingTitles[toppingsAnimatorsKey];

			// add pre to enable onHidden
			revealFrameAnimator.add({ index: -1, type: "null" });

			// add pre to enable onHidden
			hoverFrameAnimator.add({ index: -1, type: "null" });

			// add container background reveal
			revealFrameAnimator.add({
				index: 0,
				type: "null",
				items: {
					totalFrames,
					offset: -(totalFrames * ((i + 1) / (toppingsAnimatorsEntries.length + 1))) / 4,
					bezier: [0.25, 1, 0.5, 1],
					onHidden: () => {
						const containerDomContent = $(title.parentElement);
						containerDomContent.css({ opacity: 0 });
					},
					onFrame: (animation, frame) => {
						const { totalFrames: animationTotalFrames } = animation.items;
						const containerDomContent = $(title.parentElement);

						if (frame > 0) {
							containerDomContent.css({
								width: `${frame / animationTotalFrames * 100}%`,
								opacity: 1
							});

							return;
						}

						containerDomContent.css({
							width: `${frame / animationTotalFrames * 100}%`,
							opacity: 0
						});
					}
				}
			});

			Array.from(title.children).forEach((node, index) => {
				// add reveal animations
				revealFrameAnimator.add({
					index: 0,
					type: "null",
					items: {
						totalFrames,
						offset: -(totalFrames * (// prefix and suffix changes the length of textContent, so just get it from dom
						(title.innerText.length - index) / title.innerText.length)) / 4,
						bezier: [0.165, 0.84, 0.44, 1],
						onHidden: () => {
							const domContent = $(node);
							domContent.css({ opacity: 0 });
						},
						onFrame: (animation, frame) => {
							const { totalFrames: animationTotalFrames } = animation.items;
							const domContent = $(node);

							domContent.css({
								transform: `translateX(-${(animationTotalFrames - frame) * 2}px)`,
								opacity: 1
							});
						}
					}
				});

				// if the currently working item is not the prefix
				if (node.classList.contains("prefix")) {
					return;
				}

				// add hover animations
				hoverFrameAnimator.add({
					index: 0,
					type: "null",
					items: {
						totalFrames,
						offset: -(totalFrames * (index / title.innerText.length)),
						bezier: [0.25, 1, 0.5, 1],
						onHidden: () => {
							const domContent = $(node);
							domContent.css({ transform: "translateY(0px)" });
						},
						onFrame: (animation, frame) => {
							const domContent = $(node);
							const { totalFrames: animationTotalFrames } = animation.items;

							switch (true) {
								case !currentOnMouseChildDom.classList.contains("prefix"):
									domContent.removeClass("forced");
									break;
								case frame <= animationTotalFrames / 2:
									domContent.removeClass("forced");
									break;
								case frame > animationTotalFrames / 2:
									// if currently hovering on prefix, add 'forced'
									if (!currentOnMouseChildDom.classList.contains("prefix")) {
										break;
									}
									domContent.addClass("forced");
									break;
								default:
							}

							domContent.css({
								transform: `translateY(${index % 2 === 0 ? "" : "-"}${frame / 14}px)`
							});
						}
					}
				});
			});
		});
	}

	function animateToppingHover(toppingsKey, state) {
		const { totalFrames } = toppingsAnimators[toppingsKey].hoverFrameAnimator.animations[0][0].items;
		let end;

		switch (state) {
			case "over":
				end = totalFrames;
				break;
			case "out":
				end = 0;
				break;
			default:
				return;
		}

		const { hoverFrameAnimator } = toppingsAnimators[toppingsKey];
		const options = { fps: 240 };

		if (hoverFrameAnimator.currentFrame === end && end === 0) {
			hoverFrameAnimator.animate(end, end + 1, options);
			return;
		}

		hoverFrameAnimator.animate(hoverFrameAnimator.currentFrame, end, options);
	}

	function animateToppingReveal(toppingsKey, state) {
		const { totalFrames } = toppingsAnimators[toppingsKey].hoverFrameAnimator.animations[0][0].items;
		let end = null;
		let speed = null;

		switch (state) {
			case "reveal":
				end = totalFrames;
				speed = 1;
				break;
			case "hide":
				end = 0;
				speed = 2;
				break;
			default:
				return;
		}

		const { revealFrameAnimator } = toppingsAnimators[toppingsKey];

		if (revealFrameAnimator.currentFrame === end) {
			revealFrameAnimator.animate(end, end + 1);
			return;
		}

		revealFrameAnimator.animate(revealFrameAnimator.currentFrame, end, { speed });
	}

	const writable_props = [
		"isActiveW",
		"toppings",
		"buttonSize",
		"backgroundColour",
		"prefix",
		"suffix",
		"totalFrames"
	];

	Object_1.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Hamburger2> was created with unknown prop '${key}'`);
	});

	function lottietogglebutton_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			lottieToggleButton = $$value;
			$$invalidate(8, lottieToggleButton);
		});
	}

	function lottietogglebutton_isActiveW_binding(value) {
		isActiveW = value;
		$$subscribe_isActiveW($$invalidate(0, isActiveW));
	}

	function string_binding($$value, key) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			toppingTitles[key] = $$value;
			$$invalidate(6, toppingTitles);
			$$invalidate(1, toppings);
		});
	}

	const click_handler = value => {
		isActiveW.set(false);
		value();
	};

	const mouseover_handler = // @ts-expect-error
	(key, event) => {
		$$invalidate(9, currentOnMouseChildDom = event.target);
		animateToppingHover(key, "over");
	};

	const mouseout_handler = // @ts-expect-error
	(key, event) => {
		$$invalidate(9, currentOnMouseChildDom = event.target);
		animateToppingHover(key, "out");
	};

	function container_binding($$value, key) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			toppingContainers[key] = $$value;
			$$invalidate(10, toppingContainers);
			$$invalidate(1, toppings);
		});
	}

	$$self.$$set = $$props => {
		if ("isActiveW" in $$props) $$subscribe_isActiveW($$invalidate(0, isActiveW = $$props.isActiveW));
		if ("toppings" in $$props) $$invalidate(1, toppings = $$props.toppings);
		if ("buttonSize" in $$props) $$invalidate(2, buttonSize = $$props.buttonSize);
		if ("backgroundColour" in $$props) $$invalidate(3, backgroundColour = $$props.backgroundColour);
		if ("prefix" in $$props) $$invalidate(4, prefix = $$props.prefix);
		if ("suffix" in $$props) $$invalidate(5, suffix = $$props.suffix);
		if ("totalFrames" in $$props) $$invalidate(15, totalFrames = $$props.totalFrames);
	};

	$$self.$capture_state = () => ({
		onDestroy,
		onMount,
		writable,
		LottieToggleButton,
		hamburger,
		CSSUtility,
		S: $,
		FrameAnimator,
		Ripple,
		isActiveW,
		toppings,
		buttonSize,
		backgroundColour,
		prefix,
		suffix,
		totalFrames,
		lottieToggleButton,
		currentOnMouseChildDom,
		toppingTitles,
		toppingContainers,
		toppingsAnimators,
		rippleItems,
		onMouseDown,
		onPopState,
		createAnimations,
		animateToppingHover,
		animateToppingReveal,
		$isActiveW,
		$rippleItems
	});

	$$self.$inject_state = $$props => {
		if ("isActiveW" in $$props) $$subscribe_isActiveW($$invalidate(0, isActiveW = $$props.isActiveW));
		if ("toppings" in $$props) $$invalidate(1, toppings = $$props.toppings);
		if ("buttonSize" in $$props) $$invalidate(2, buttonSize = $$props.buttonSize);
		if ("backgroundColour" in $$props) $$invalidate(3, backgroundColour = $$props.backgroundColour);
		if ("prefix" in $$props) $$invalidate(4, prefix = $$props.prefix);
		if ("suffix" in $$props) $$invalidate(5, suffix = $$props.suffix);
		if ("totalFrames" in $$props) $$invalidate(15, totalFrames = $$props.totalFrames);
		if ("lottieToggleButton" in $$props) $$invalidate(8, lottieToggleButton = $$props.lottieToggleButton);
		if ("currentOnMouseChildDom" in $$props) $$invalidate(9, currentOnMouseChildDom = $$props.currentOnMouseChildDom);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty[0] & /*toppingTitles, $isActiveW*/ 192) {
			$: Object.keys(toppingTitles).forEach(toppingTitlesKey => animateToppingReveal(toppingTitlesKey, $isActiveW ? "reveal" : "hide"));
		}
	};

	return [
		isActiveW,
		toppings,
		buttonSize,
		backgroundColour,
		prefix,
		suffix,
		toppingTitles,
		$isActiveW,
		lottieToggleButton,
		currentOnMouseChildDom,
		toppingContainers,
		$rippleItems,
		toppingsAnimators,
		rippleItems,
		animateToppingHover,
		totalFrames,
		lottietogglebutton_binding,
		lottietogglebutton_isActiveW_binding,
		string_binding,
		click_handler,
		mouseover_handler,
		mouseout_handler,
		container_binding
	];
}

class Hamburger2 extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(
			this,
			options,
			instance$8,
			create_fragment$8,
			safe_not_equal,
			{
				isActiveW: 0,
				toppings: 1,
				buttonSize: 2,
				backgroundColour: 3,
				prefix: 4,
				suffix: 5,
				totalFrames: 15
			},
			[-1, -1]
		);

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Hamburger2",
			options,
			id: create_fragment$8.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*toppings*/ ctx[1] === undefined && !("toppings" in props)) {
			console.warn("<Hamburger2> was created without expected prop 'toppings'");
		}
	}

	get isActiveW() {
		return this.$$.ctx[0];
	}

	set isActiveW(isActiveW) {
		this.$set({ isActiveW });
		flush();
	}

	get toppings() {
		return this.$$.ctx[1];
	}

	set toppings(toppings) {
		this.$set({ toppings });
		flush();
	}

	get buttonSize() {
		return this.$$.ctx[2];
	}

	set buttonSize(buttonSize) {
		this.$set({ buttonSize });
		flush();
	}

	get backgroundColour() {
		return this.$$.ctx[3];
	}

	set backgroundColour(backgroundColour) {
		this.$set({ backgroundColour });
		flush();
	}

	get prefix() {
		return this.$$.ctx[4];
	}

	set prefix(prefix) {
		this.$set({ prefix });
		flush();
	}

	get suffix() {
		return this.$$.ctx[5];
	}

	set suffix(suffix) {
		this.$set({ suffix });
		flush();
	}

	get totalFrames() {
		return this.$$.ctx[15];
	}

	set totalFrames(totalFrames) {
		this.$set({ totalFrames });
		flush();
	}
}

var undefined$8 = undefined;

/* src\ui\blocks\buttons\SvgButton.svelte generated by Svelte v3.38.2 */
const file$7 = "src\\ui\\blocks\\buttons\\SvgButton.svelte";

// (69:9)       
function fallback_block(ctx) {
	let placeholder;

	const block = {
		c: function create() {
			placeholder = element("placeholder");
			add_location(placeholder, file$7, 69, 4, 2195);
		},
		m: function mount(target, anchor) {
			insert_dev(target, placeholder, anchor);
			/*placeholder_binding*/ ctx[15](placeholder);
		},
		p: noop$1,
		d: function destroy(detaching) {
			if (detaching) detach_dev(placeholder);
			/*placeholder_binding*/ ctx[15](null);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: fallback_block.name,
		type: "fallback",
		source: "(69:9)       ",
		ctx
	});

	return block;
}

// (53:1) <Button    {...$$restProps}    {height}    {width}    {backgroundColour}    {hoverColour}    isText={false}    padding='16px 16px'    roundness='50px'    on:click={() => dispatch('click')}   >
function create_default_slot$3(ctx) {
	let container;
	let current;
	const default_slot_template = /*#slots*/ ctx[14].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[17], null);
	const default_slot_or_fallback = default_slot || fallback_block(ctx);

	const block = {
		c: function create() {
			container = element("container");
			if (default_slot_or_fallback) default_slot_or_fallback.c();
			set_style(container, "--svg-colour", /*svgColour*/ ctx[6]);
			attr_dev(container, "class", "svelte-3pzsgw");
			add_location(container, file$7, 63, 2, 2113);
		},
		m: function mount(target, anchor) {
			insert_dev(target, container, anchor);

			if (default_slot_or_fallback) {
				default_slot_or_fallback.m(container, null);
			}

			current = true;
		},
		p: function update(ctx, dirty) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 131072)) {
					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[17], dirty, null, null);
				}
			} else {
				if (default_slot_or_fallback && default_slot_or_fallback.p && dirty & /*svgPlaceholderDomContent*/ 128) {
					default_slot_or_fallback.p(ctx, dirty);
				}
			}

			if (!current || dirty & /*svgColour*/ 64) {
				set_style(container, "--svg-colour", /*svgColour*/ ctx[6]);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot_or_fallback, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot_or_fallback, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(container);
			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot$3.name,
		type: "slot",
		source: "(53:1) <Button    {...$$restProps}    {height}    {width}    {backgroundColour}    {hoverColour}    isText={false}    padding='16px 16px'    roundness='50px'    on:click={() => dispatch('click')}   >",
		ctx
	});

	return block;
}

function create_fragment$7(ctx) {
	let component;
	let button;
	let current;

	const button_spread_levels = [
		/*$$restProps*/ ctx[9],
		{ height: /*height*/ ctx[2] },
		{ width: /*width*/ ctx[3] },
		{
			backgroundColour: /*backgroundColour*/ ctx[1]
		},
		{ hoverColour: /*hoverColour*/ ctx[0] },
		{ isText: false },
		{ padding: "16px 16px" },
		{ roundness: "50px" }
	];

	let button_props = {
		$$slots: { default: [create_default_slot$3] },
		$$scope: { ctx }
	};

	for (let i = 0; i < button_spread_levels.length; i += 1) {
		button_props = assign(button_props, button_spread_levels[i]);
	}

	button = new Button({ props: button_props, $$inline: true });
	button.$on("click", /*click_handler*/ ctx[16]);

	const block = {
		c: function create() {
			component = element("component");
			create_component(button.$$.fragment);
			set_style(component, "--height", CSSUtility.parse(/*height*/ ctx[2]));
			set_style(component, "--width", CSSUtility.parse(/*width*/ ctx[3]));
			add_location(component, file$7, 46, 0, 1807);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, component, anchor);
			mount_component(button, component, null);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			const button_changes = (dirty & /*$$restProps, height, width, backgroundColour, hoverColour*/ 527)
			? get_spread_update(button_spread_levels, [
					dirty & /*$$restProps*/ 512 && get_spread_object(/*$$restProps*/ ctx[9]),
					dirty & /*height*/ 4 && { height: /*height*/ ctx[2] },
					dirty & /*width*/ 8 && { width: /*width*/ ctx[3] },
					dirty & /*backgroundColour*/ 2 && {
						backgroundColour: /*backgroundColour*/ ctx[1]
					},
					dirty & /*hoverColour*/ 1 && { hoverColour: /*hoverColour*/ ctx[0] },
					button_spread_levels[5],
					button_spread_levels[6],
					button_spread_levels[7]
				])
			: {};

			if (dirty & /*$$scope, svgColour, svgPlaceholderDomContent*/ 131264) {
				button_changes.$$scope = { dirty, ctx };
			}

			button.$set(button_changes);

			if (!current || dirty & /*height*/ 4) {
				set_style(component, "--height", CSSUtility.parse(/*height*/ ctx[2]));
			}

			if (!current || dirty & /*width*/ 8) {
				set_style(component, "--width", CSSUtility.parse(/*width*/ ctx[3]));
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(button.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(button.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(component);
			destroy_component(button);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$7.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$7($$self, $$props, $$invalidate) {
	const omit_props_names = [
		"hoverColour","backgroundColour","height","width","svgSrc","svgSrcW","svg","svgW","svgColour"
	];

	let $$restProps = compute_rest_props($$props, omit_props_names);

	let $svgSrcW,
		$$unsubscribe_svgSrcW = noop$1,
		$$subscribe_svgSrcW = () => ($$unsubscribe_svgSrcW(), $$unsubscribe_svgSrcW = subscribe(svgSrcW, $$value => $$invalidate(12, $svgSrcW = $$value)), svgSrcW);

	let $svgW,
		$$unsubscribe_svgW = noop$1,
		$$subscribe_svgW = () => ($$unsubscribe_svgW(), $$unsubscribe_svgW = subscribe(svgW, $$value => $$invalidate(13, $svgW = $$value)), svgW);

	$$self.$$.on_destroy.push(() => $$unsubscribe_svgSrcW());
	$$self.$$.on_destroy.push(() => $$unsubscribe_svgW());
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("SvgButton", slots, ['default']);

	var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P
			? value
			: new P(function (resolve) {
						resolve(value);
					});
		}

		return new (P || (P = Promise))(function (resolve, reject) {
				function fulfilled(value) {
					try {
						step(generator.next(value));
					} catch(e) {
						reject(e);
					}
				}

				function rejected(value) {
					try {
						step(generator["throw"](value));
					} catch(e) {
						reject(e);
					}
				}

				function step(result) {
					result.done
					? resolve(result.value)
					: adopt(result.value).then(fulfilled, rejected);
				}

				step((generator = generator.apply(thisArg, _arguments || [])).next());
			});
	};

	let { hoverColour = "#0000" } = $$props;
	let { backgroundColour = "#0000" } = $$props;
	let { height = "100%" } = $$props;
	let { width = "100%" } = $$props;
	let { svgSrc = "" } = $$props;
	let { svgSrcW = writable(svgSrc) } = $$props;
	validate_store(svgSrcW, "svgSrcW");
	$$subscribe_svgSrcW();
	let { svg = "" } = $$props;
	let { svgW = writable(svg) } = $$props;
	validate_store(svgW, "svgW");
	$$subscribe_svgW();
	let { svgColour = backgroundColour } = $$props;
	const dispatch = createEventDispatcher();
	let svgPlaceholderDomContent;

	function placeholder_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			svgPlaceholderDomContent = $$value;
			(((($$invalidate(7, svgPlaceholderDomContent), $$invalidate(13, $svgW)), $$invalidate(12, $svgSrcW)), $$invalidate(18, __awaiter)), $$invalidate(10, svgSrc));
		});
	}

	const click_handler = () => dispatch("click");

	$$self.$$set = $$new_props => {
		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
		$$invalidate(9, $$restProps = compute_rest_props($$props, omit_props_names));
		if ("hoverColour" in $$new_props) $$invalidate(0, hoverColour = $$new_props.hoverColour);
		if ("backgroundColour" in $$new_props) $$invalidate(1, backgroundColour = $$new_props.backgroundColour);
		if ("height" in $$new_props) $$invalidate(2, height = $$new_props.height);
		if ("width" in $$new_props) $$invalidate(3, width = $$new_props.width);
		if ("svgSrc" in $$new_props) $$invalidate(10, svgSrc = $$new_props.svgSrc);
		if ("svgSrcW" in $$new_props) $$subscribe_svgSrcW($$invalidate(4, svgSrcW = $$new_props.svgSrcW));
		if ("svg" in $$new_props) $$invalidate(11, svg = $$new_props.svg);
		if ("svgW" in $$new_props) $$subscribe_svgW($$invalidate(5, svgW = $$new_props.svgW));
		if ("svgColour" in $$new_props) $$invalidate(6, svgColour = $$new_props.svgColour);
		if ("$$scope" in $$new_props) $$invalidate(17, $$scope = $$new_props.$$scope);
	};

	$$self.$capture_state = () => ({
		__awaiter,
		createEventDispatcher,
		writable,
		Button,
		CSSUtility,
		hoverColour,
		backgroundColour,
		height,
		width,
		svgSrc,
		svgSrcW,
		svg,
		svgW,
		svgColour,
		dispatch,
		svgPlaceholderDomContent,
		$svgSrcW,
		$svgW
	});

	$$self.$inject_state = $$new_props => {
		if ("__awaiter" in $$props) $$invalidate(18, __awaiter = $$new_props.__awaiter);
		if ("hoverColour" in $$props) $$invalidate(0, hoverColour = $$new_props.hoverColour);
		if ("backgroundColour" in $$props) $$invalidate(1, backgroundColour = $$new_props.backgroundColour);
		if ("height" in $$props) $$invalidate(2, height = $$new_props.height);
		if ("width" in $$props) $$invalidate(3, width = $$new_props.width);
		if ("svgSrc" in $$props) $$invalidate(10, svgSrc = $$new_props.svgSrc);
		if ("svgSrcW" in $$props) $$subscribe_svgSrcW($$invalidate(4, svgSrcW = $$new_props.svgSrcW));
		if ("svg" in $$props) $$invalidate(11, svg = $$new_props.svg);
		if ("svgW" in $$props) $$subscribe_svgW($$invalidate(5, svgW = $$new_props.svgW));
		if ("svgColour" in $$props) $$invalidate(6, svgColour = $$new_props.svgColour);
		if ("svgPlaceholderDomContent" in $$props) $$invalidate(7, svgPlaceholderDomContent = $$new_props.svgPlaceholderDomContent);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*$svgSrcW, svgSrc*/ 5120) {
			$: ($svgSrcW, () => __awaiter(void 0, void 0, void 0, function* () {
				set_store_value(svgW, $svgW = yield (yield fetch(svgSrc)).text(), $svgW);
			}));
		}

		if ($$self.$$.dirty & /*svgPlaceholderDomContent, $svgW*/ 8320) {
			$: svgPlaceholderDomContent && $$invalidate(7, svgPlaceholderDomContent.outerHTML = $svgW !== null && $svgW !== void 0 ? $svgW : "", svgPlaceholderDomContent);
		}
	};

	return [
		hoverColour,
		backgroundColour,
		height,
		width,
		svgSrcW,
		svgW,
		svgColour,
		svgPlaceholderDomContent,
		dispatch,
		$$restProps,
		svgSrc,
		svg,
		$svgSrcW,
		$svgW,
		slots,
		placeholder_binding,
		click_handler,
		$$scope
	];
}

class SvgButton extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$7, create_fragment$7, safe_not_equal, {
			hoverColour: 0,
			backgroundColour: 1,
			height: 2,
			width: 3,
			svgSrc: 10,
			svgSrcW: 4,
			svg: 11,
			svgW: 5,
			svgColour: 6
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "SvgButton",
			options,
			id: create_fragment$7.name
		});
	}

	get hoverColour() {
		return this.$$.ctx[0];
	}

	set hoverColour(hoverColour) {
		this.$set({ hoverColour });
		flush();
	}

	get backgroundColour() {
		return this.$$.ctx[1];
	}

	set backgroundColour(backgroundColour) {
		this.$set({ backgroundColour });
		flush();
	}

	get height() {
		return this.$$.ctx[2];
	}

	set height(height) {
		this.$set({ height });
		flush();
	}

	get width() {
		return this.$$.ctx[3];
	}

	set width(width) {
		this.$set({ width });
		flush();
	}

	get svgSrc() {
		return this.$$.ctx[10];
	}

	set svgSrc(svgSrc) {
		this.$set({ svgSrc });
		flush();
	}

	get svgSrcW() {
		return this.$$.ctx[4];
	}

	set svgSrcW(svgSrcW) {
		this.$set({ svgSrcW });
		flush();
	}

	get svg() {
		return this.$$.ctx[11];
	}

	set svg(svg) {
		this.$set({ svg });
		flush();
	}

	get svgW() {
		return this.$$.ctx[5];
	}

	set svgW(svgW) {
		this.$set({ svgW });
		flush();
	}

	get svgColour() {
		return this.$$.ctx[6];
	}

	set svgColour(svgColour) {
		this.$set({ svgColour });
		flush();
	}
}

var undefined$7 = undefined;

/* src\ui\blocks\Logo.svelte generated by Svelte v3.38.2 */
const file$6 = "src\\ui\\blocks\\Logo.svelte";

function create_fragment$6(ctx) {
	let component;
	let svgbutton;
	let current;

	svgbutton = new SvgButton({
			props: {
				svg: "\r\n\t\t<svg height=20px width=24px xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1000 749\" fill=" + CSSUtility.parse(/*colour*/ ctx[0]) + ">\r\n\t\t\t<g id=\"Layer_2\" data-name=\"Layer 2\">\r\n\t\t\t\t<rect x=\"750\" width=\"250\" height=\"250\"/>\r\n\t\t\t</g>\r\n\t\t\t<g id=\"Layer_3\" data-name=\"Layer 3\">\r\n\t\t\t\t<rect x=\"500\" y=\"250\" width=\"250\" height=\"250\"/>\r\n\t\t\t</g>\r\n\t\t\t<g id=\"Layer_4\" data-name=\"Layer 4\">\r\n\t\t\t\t<rect y=\"499\" width=\"250\" height=\"250\"/>\r\n\t\t\t</g>\r\n\t\t\t<g id=\"Layer_5\" data-name=\"Layer 5\">\r\n\t\t\t\t<rect x=\"250\" width=\"250\" height=\"500\"/>\r\n\t\t\t</g>\r\n\t\t</svg>\r\n\t\t"
			},
			$$inline: true
		});

	svgbutton.$on("click", /*click_handler*/ ctx[1]);

	const block = {
		c: function create() {
			component = element("component");
			create_component(svgbutton.$$.fragment);
			attr_dev(component, "class", "svelte-cs6f8h");
			add_location(component, file$6, 6, 0, 235);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, component, anchor);
			mount_component(svgbutton, component, null);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			const svgbutton_changes = {};
			if (dirty & /*colour*/ 1) svgbutton_changes.svg = "\r\n\t\t<svg height=20px width=24px xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1000 749\" fill=" + CSSUtility.parse(/*colour*/ ctx[0]) + ">\r\n\t\t\t<g id=\"Layer_2\" data-name=\"Layer 2\">\r\n\t\t\t\t<rect x=\"750\" width=\"250\" height=\"250\"/>\r\n\t\t\t</g>\r\n\t\t\t<g id=\"Layer_3\" data-name=\"Layer 3\">\r\n\t\t\t\t<rect x=\"500\" y=\"250\" width=\"250\" height=\"250\"/>\r\n\t\t\t</g>\r\n\t\t\t<g id=\"Layer_4\" data-name=\"Layer 4\">\r\n\t\t\t\t<rect y=\"499\" width=\"250\" height=\"250\"/>\r\n\t\t\t</g>\r\n\t\t\t<g id=\"Layer_5\" data-name=\"Layer 5\">\r\n\t\t\t\t<rect x=\"250\" width=\"250\" height=\"500\"/>\r\n\t\t\t</g>\r\n\t\t</svg>\r\n\t\t";
			svgbutton.$set(svgbutton_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(svgbutton.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(svgbutton.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(component);
			destroy_component(svgbutton);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$6.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$6($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("Logo", slots, []);
	let { colour = "--colour-accent-primary" } = $$props;
	const writable_props = ["colour"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Logo> was created with unknown prop '${key}'`);
	});

	const click_handler = () => {
		if (window.location.href.includes("#")) {
			push("/");
		}

		window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
	};

	$$self.$$set = $$props => {
		if ("colour" in $$props) $$invalidate(0, colour = $$props.colour);
	};

	$$self.$capture_state = () => ({ router, SvgButton, CSSUtility, colour });

	$$self.$inject_state = $$props => {
		if ("colour" in $$props) $$invalidate(0, colour = $$props.colour);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [colour, click_handler];
}

class Logo extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$6, create_fragment$6, safe_not_equal, { colour: 0 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Logo",
			options,
			id: create_fragment$6.name
		});
	}

	get colour() {
		return this.$$.ctx[0];
	}

	set colour(colour) {
		this.$set({ colour });
		flush();
	}
}

var undefined$6 = undefined;

/* src\ui\blocks\Spacer.svelte generated by Svelte v3.38.2 */
const file$5 = "src\\ui\\blocks\\Spacer.svelte";

function create_fragment$5(ctx) {
	let component;

	const block = {
		c: function create() {
			component = element("component");
			set_style(component, "--height", "calc(" + CSSUtility.parse(+(/*direction*/ ctx[3] === /*Directions*/ ctx[0].HORIZONTAL) && /*$heightW*/ ctx[4]) + " - 1px)");
			set_style(component, "--width", "calc(" + CSSUtility.parse(+(/*direction*/ ctx[3] === /*Directions*/ ctx[0].VERTICAL) && /*$widthW*/ ctx[5]) + " - 1px)");
			attr_dev(component, "class", "svelte-1jw2pdz");
			add_location(component, file$5, 14, 0, 378);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, component, anchor);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*direction, $heightW*/ 24) {
				set_style(component, "--height", "calc(" + CSSUtility.parse(+(/*direction*/ ctx[3] === /*Directions*/ ctx[0].HORIZONTAL) && /*$heightW*/ ctx[4]) + " - 1px)");
			}

			if (dirty & /*direction, $widthW*/ 40) {
				set_style(component, "--width", "calc(" + CSSUtility.parse(+(/*direction*/ ctx[3] === /*Directions*/ ctx[0].VERTICAL) && /*$widthW*/ ctx[5]) + " - 1px)");
			}
		},
		i: noop$1,
		o: noop$1,
		d: function destroy(detaching) {
			if (detaching) detach_dev(component);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$5.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$5($$self, $$props, $$invalidate) {
	let $heightW,
		$$unsubscribe_heightW = noop$1,
		$$subscribe_heightW = () => ($$unsubscribe_heightW(), $$unsubscribe_heightW = subscribe(heightW, $$value => $$invalidate(4, $heightW = $$value)), heightW);

	let $widthW,
		$$unsubscribe_widthW = noop$1,
		$$subscribe_widthW = () => ($$unsubscribe_widthW(), $$unsubscribe_widthW = subscribe(widthW, $$value => $$invalidate(5, $widthW = $$value)), widthW);

	$$self.$$.on_destroy.push(() => $$unsubscribe_heightW());
	$$self.$$.on_destroy.push(() => $$unsubscribe_widthW());
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("Spacer", slots, []);
	
	const Directions = { HORIZONTAL: 0, VERTICAL: 1 };
	let { height = 24 } = $$props;
	let { width = 24 } = $$props;
	let { heightW = writable(height) } = $$props;
	validate_store(heightW, "heightW");
	$$subscribe_heightW();
	let { widthW = writable(width) } = $$props;
	validate_store(widthW, "widthW");
	$$subscribe_widthW();
	let { direction = Directions.HORIZONTAL } = $$props;
	const writable_props = ["height", "width", "heightW", "widthW", "direction"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Spacer> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ("height" in $$props) $$invalidate(6, height = $$props.height);
		if ("width" in $$props) $$invalidate(7, width = $$props.width);
		if ("heightW" in $$props) $$subscribe_heightW($$invalidate(1, heightW = $$props.heightW));
		if ("widthW" in $$props) $$subscribe_widthW($$invalidate(2, widthW = $$props.widthW));
		if ("direction" in $$props) $$invalidate(3, direction = $$props.direction);
	};

	$$self.$capture_state = () => ({
		writable,
		CSSUtility,
		Directions,
		height,
		width,
		heightW,
		widthW,
		direction,
		$heightW,
		$widthW
	});

	$$self.$inject_state = $$props => {
		if ("height" in $$props) $$invalidate(6, height = $$props.height);
		if ("width" in $$props) $$invalidate(7, width = $$props.width);
		if ("heightW" in $$props) $$subscribe_heightW($$invalidate(1, heightW = $$props.heightW));
		if ("widthW" in $$props) $$subscribe_widthW($$invalidate(2, widthW = $$props.widthW));
		if ("direction" in $$props) $$invalidate(3, direction = $$props.direction);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [Directions, heightW, widthW, direction, $heightW, $widthW, height, width];
}

class Spacer extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
			Directions: 0,
			height: 6,
			width: 7,
			heightW: 1,
			widthW: 2,
			direction: 3
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Spacer",
			options,
			id: create_fragment$5.name
		});
	}

	get Directions() {
		return this.$$.ctx[0];
	}

	set Directions(value) {
		throw new Error("<Spacer>: Cannot set read-only property 'Directions'");
	}

	get height() {
		return this.$$.ctx[6];
	}

	set height(height) {
		this.$set({ height });
		flush();
	}

	get width() {
		return this.$$.ctx[7];
	}

	set width(width) {
		this.$set({ width });
		flush();
	}

	get heightW() {
		return this.$$.ctx[1];
	}

	set heightW(heightW) {
		this.$set({ heightW });
		flush();
	}

	get widthW() {
		return this.$$.ctx[2];
	}

	set widthW(widthW) {
		this.$set({ widthW });
		flush();
	}

	get direction() {
		return this.$$.ctx[3];
	}

	set direction(direction) {
		this.$set({ direction });
		flush();
	}
}

var undefined$5 = undefined;

/* src\ui\blocks\AppBar.svelte generated by Svelte v3.38.2 */

const file$4 = "src\\ui\\blocks\\AppBar.svelte";
const get_background_slot_changes = dirty => ({});
const get_background_slot_context = ctx => ({});

// (73:3) {:else}
function create_else_block(ctx) {
	let heading;
	let t_value = (/*titleCase*/ ctx[8] === "upper" && /*title*/ ctx[3].toUpperCase() || /*titleCase*/ ctx[8] === "lower" && /*title*/ ctx[3].toLowerCase() || /*title*/ ctx[3]) + "";
	let t;

	const block = {
		c: function create() {
			heading = element("heading");
			t = text(t_value);
			attr_dev(heading, "class", "svelte-11ca1a6");
			add_location(heading, file$4, 73, 4, 2397);
		},
		m: function mount(target, anchor) {
			insert_dev(target, heading, anchor);
			append_dev(heading, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*titleCase, title*/ 264 && t_value !== (t_value = (/*titleCase*/ ctx[8] === "upper" && /*title*/ ctx[3].toUpperCase() || /*titleCase*/ ctx[8] === "lower" && /*title*/ ctx[3].toLowerCase() || /*title*/ ctx[3]) + "")) set_data_dev(t, t_value);
		},
		i: noop$1,
		o: noop$1,
		d: function destroy(detaching) {
			if (detaching) detach_dev(heading);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block.name,
		type: "else",
		source: "(73:3) {:else}",
		ctx
	});

	return block;
}

// (67:3) {#if title == null}
function create_if_block_1(ctx) {
	let container;
	let logo;
	let current;

	logo = new Logo({
			props: { colour: "--colour-text-primary" },
			$$inline: true
		});

	const block = {
		c: function create() {
			container = element("container");
			create_component(logo.$$.fragment);
			attr_dev(container, "class", "logo svelte-11ca1a6");
			add_location(container, file$4, 67, 4, 2278);
		},
		m: function mount(target, anchor) {
			insert_dev(target, container, anchor);
			mount_component(logo, container, null);
			current = true;
		},
		p: noop$1,
		i: function intro(local) {
			if (current) return;
			transition_in(logo.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(logo.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(container);
			destroy_component(logo);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1.name,
		type: "if",
		source: "(67:3) {#if title == null}",
		ctx
	});

	return block;
}

// (97:1) {#if $isSpacedW}
function create_if_block$1(ctx) {
	let container;
	let spacer;
	let container_intro;
	let container_outro;
	let current;

	spacer = new Spacer({
			props: { heightW: /*expandedHeightW*/ ctx[0] },
			$$inline: true
		});

	const block = {
		c: function create() {
			container = element("container");
			create_component(spacer.$$.fragment);
			add_location(container, file$4, 97, 2, 2758);
		},
		m: function mount(target, anchor) {
			insert_dev(target, container, anchor);
			mount_component(spacer, container, null);
			current = true;
		},
		p: function update(ctx, dirty) {
			const spacer_changes = {};
			if (dirty & /*expandedHeightW*/ 1) spacer_changes.heightW = /*expandedHeightW*/ ctx[0];
			spacer.$set(spacer_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(spacer.$$.fragment, local);

			add_render_callback(() => {
				if (container_outro) container_outro.end(1);
				if (!container_intro) container_intro = create_in_transition(container, /*dropIn*/ ctx[14], {});
				container_intro.start();
			});

			current = true;
		},
		o: function outro(local) {
			transition_out(spacer.$$.fragment, local);
			if (container_intro) container_intro.invalidate();
			container_outro = create_out_transition(container, /*dropOut*/ ctx[15], {});
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(container);
			destroy_component(spacer);
			if (detaching && container_outro) container_outro.end();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$1.name,
		type: "if",
		source: "(97:1) {#if $isSpacedW}",
		ctx
	});

	return block;
}

function create_fragment$4(ctx) {
	let component;
	let container3;
	let container0;
	let t0;
	let container1;
	let current_block_type_index;
	let if_block0;
	let t1;
	let container2;
	let container3_intro;
	let container3_outro;
	let t2;
	let current;
	const background_slot_template = /*#slots*/ ctx[22].background;
	const background_slot = create_slot(background_slot_template, ctx, /*$$scope*/ ctx[21], get_background_slot_context);
	const if_block_creators = [create_if_block_1, create_else_block];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*title*/ ctx[3] == null) return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx, -1);
	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
	const default_slot_template = /*#slots*/ ctx[22].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[21], null);
	let if_block1 = /*$isSpacedW*/ ctx[13] && create_if_block$1(ctx);

	const block = {
		c: function create() {
			component = element("component");
			container3 = element("container");
			container0 = element("container");
			if (background_slot) background_slot.c();
			t0 = space();
			container1 = element("container");
			if_block0.c();
			t1 = space();
			container2 = element("container");
			if (default_slot) default_slot.c();
			t2 = space();
			if (if_block1) if_block1.c();
			attr_dev(container0, "class", "slot svelte-11ca1a6");
			add_location(container0, file$4, 57, 2, 2123);
			attr_dev(container1, "class", "content left svelte-11ca1a6");
			add_location(container1, file$4, 63, 2, 2208);
			attr_dev(container2, "class", "content right svelte-11ca1a6");
			add_location(container2, file$4, 89, 2, 2647);
			attr_dev(container3, "class", "app-bar svelte-11ca1a6");
			set_style(container3, "--app-bar-padding", CSSUtility.parse(/*$appBarPaddingW*/ ctx[11]));
			set_style(container3, "--content-padding", CSSUtility.parse(/*$contentPaddingW*/ ctx[12]));
			set_style(container3, "--colour-background", CSSUtility.parse(/*backgroundColour*/ ctx[6]));
			set_style(container3, "--border-radius", CSSUtility.parse(/*borderRadius*/ ctx[9]));
			add_location(container3, file$4, 45, 1, 1760);
			add_location(component, file$4, 44, 0, 1746);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, component, anchor);
			append_dev(component, container3);
			append_dev(container3, container0);

			if (background_slot) {
				background_slot.m(container0, null);
			}

			append_dev(container3, t0);
			append_dev(container3, container1);
			if_blocks[current_block_type_index].m(container1, null);
			append_dev(container3, t1);
			append_dev(container3, container2);

			if (default_slot) {
				default_slot.m(container2, null);
			}

			/*container3_binding*/ ctx[23](container3);
			append_dev(component, t2);
			if (if_block1) if_block1.m(component, null);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (background_slot) {
				if (background_slot.p && (!current || dirty & /*$$scope*/ 2097152)) {
					update_slot(background_slot, background_slot_template, ctx, /*$$scope*/ ctx[21], dirty, get_background_slot_changes, get_background_slot_context);
				}
			}

			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx, dirty);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block0 = if_blocks[current_block_type_index];

				if (!if_block0) {
					if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block0.c();
				} else {
					if_block0.p(ctx, dirty);
				}

				transition_in(if_block0, 1);
				if_block0.m(container1, null);
			}

			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 2097152)) {
					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[21], dirty, null, null);
				}
			}

			if (!current || dirty & /*$appBarPaddingW*/ 2048) {
				set_style(container3, "--app-bar-padding", CSSUtility.parse(/*$appBarPaddingW*/ ctx[11]));
			}

			if (!current || dirty & /*$contentPaddingW*/ 4096) {
				set_style(container3, "--content-padding", CSSUtility.parse(/*$contentPaddingW*/ ctx[12]));
			}

			if (!current || dirty & /*backgroundColour*/ 64) {
				set_style(container3, "--colour-background", CSSUtility.parse(/*backgroundColour*/ ctx[6]));
			}

			if (!current || dirty & /*borderRadius*/ 512) {
				set_style(container3, "--border-radius", CSSUtility.parse(/*borderRadius*/ ctx[9]));
			}

			if (/*$isSpacedW*/ ctx[13]) {
				if (if_block1) {
					if_block1.p(ctx, dirty);

					if (dirty & /*$isSpacedW*/ 8192) {
						transition_in(if_block1, 1);
					}
				} else {
					if_block1 = create_if_block$1(ctx);
					if_block1.c();
					transition_in(if_block1, 1);
					if_block1.m(component, null);
				}
			} else if (if_block1) {
				group_outros();

				transition_out(if_block1, 1, 1, () => {
					if_block1 = null;
				});

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(background_slot, local);
			transition_in(if_block0);
			transition_in(default_slot, local);

			add_render_callback(() => {
				if (container3_outro) container3_outro.end(1);
				if (!container3_intro) container3_intro = create_in_transition(container3, /*dropIn*/ ctx[14], {});
				container3_intro.start();
			});

			transition_in(if_block1);
			current = true;
		},
		o: function outro(local) {
			transition_out(background_slot, local);
			transition_out(if_block0);
			transition_out(default_slot, local);
			if (container3_intro) container3_intro.invalidate();
			container3_outro = create_out_transition(container3, /*dropOut*/ ctx[15], {});
			transition_out(if_block1);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(component);
			if (background_slot) background_slot.d(detaching);
			if_blocks[current_block_type_index].d();
			if (default_slot) default_slot.d(detaching);
			/*container3_binding*/ ctx[23](null);
			if (detaching && container3_outro) container3_outro.end();
			if (if_block1) if_block1.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$4.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$4($$self, $$props, $$invalidate) {
	let $baseHeightW,
		$$unsubscribe_baseHeightW = noop$1,
		$$subscribe_baseHeightW = () => ($$unsubscribe_baseHeightW(), $$unsubscribe_baseHeightW = subscribe(baseHeightW, $$value => $$invalidate(25, $baseHeightW = $$value)), baseHeightW);

	let $computedPaddingW,
		$$unsubscribe_computedPaddingW = noop$1,
		$$subscribe_computedPaddingW = () => ($$unsubscribe_computedPaddingW(), $$unsubscribe_computedPaddingW = subscribe(computedPaddingW, $$value => $$invalidate(26, $computedPaddingW = $$value)), computedPaddingW);

	let $appBarPaddingW,
		$$unsubscribe_appBarPaddingW = noop$1,
		$$subscribe_appBarPaddingW = () => ($$unsubscribe_appBarPaddingW(), $$unsubscribe_appBarPaddingW = subscribe(appBarPaddingW, $$value => $$invalidate(11, $appBarPaddingW = $$value)), appBarPaddingW);

	let $contentPaddingW,
		$$unsubscribe_contentPaddingW = noop$1,
		$$subscribe_contentPaddingW = () => ($$unsubscribe_contentPaddingW(), $$unsubscribe_contentPaddingW = subscribe(contentPaddingW, $$value => $$invalidate(12, $contentPaddingW = $$value)), contentPaddingW);

	let $isSpacedW,
		$$unsubscribe_isSpacedW = noop$1,
		$$subscribe_isSpacedW = () => ($$unsubscribe_isSpacedW(), $$unsubscribe_isSpacedW = subscribe(isSpacedW, $$value => $$invalidate(13, $isSpacedW = $$value)), isSpacedW);

	$$self.$$.on_destroy.push(() => $$unsubscribe_baseHeightW());
	$$self.$$.on_destroy.push(() => $$unsubscribe_computedPaddingW());
	$$self.$$.on_destroy.push(() => $$unsubscribe_appBarPaddingW());
	$$self.$$.on_destroy.push(() => $$unsubscribe_contentPaddingW());
	$$self.$$.on_destroy.push(() => $$unsubscribe_isSpacedW());
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("AppBar", slots, ['background','default']);
	
	let { expandedHeightW = writable(0) } = $$props;
	let { computedPaddingW = writable(0) } = $$props;
	validate_store(computedPaddingW, "computedPaddingW");
	$$subscribe_computedPaddingW();
	let { baseHeightW = writable(0) } = $$props;
	validate_store(baseHeightW, "baseHeightW");
	$$subscribe_baseHeightW();
	let { title = undefined } = $$props;
	let { appBarPadding = "--padding" } = $$props;
	let { appBarPaddingW = writable(appBarPadding) } = $$props;
	validate_store(appBarPaddingW, "appBarPaddingW");
	$$subscribe_appBarPaddingW();
	let { contentPadding = "0" } = $$props;
	let { contentPaddingW = writable(contentPadding) } = $$props;
	validate_store(contentPaddingW, "contentPaddingW");
	$$subscribe_contentPaddingW();
	let { isInAnimated = false } = $$props;
	let { isOutAnimated = false } = $$props;
	let { backgroundColour = "transparent" } = $$props;
	let { isSpaced = true } = $$props;
	let { isSpacedW = writable(isSpaced) } = $$props;
	validate_store(isSpacedW, "isSpacedW");
	$$subscribe_isSpacedW();
	let { titleCase = undefined } = $$props;
	let { borderRadius = 0 } = $$props;
	const dropIn$1 = isInAnimated ? dropIn : noop;
	const dropOut$1 = isOutAnimated ? dropOut : noop;
	let appBarContainerDomContent;
	let appBarContainerDomContentComputedStyle;

	onMount(() => {
		setTimeout(onResize, 0);
		window.addEventListener("resize", onResize);
	});

	onDestroy(() => {
		window.removeEventListener("resize", onResize);
	});

	function onResize() {
		appBarContainerDomContentComputedStyle = getComputedStyle(appBarContainerDomContent);
		computedPaddingW.set(Number.parseFloat(appBarContainerDomContentComputedStyle.paddingLeft));
		baseHeightW.set(appBarContainerDomContent.clientHeight - Number.parseFloat(appBarContainerDomContentComputedStyle.paddingTop) * 2);
		expandedHeightW.set($baseHeightW + $computedPaddingW * 2);
	}

	const writable_props = [
		"expandedHeightW",
		"computedPaddingW",
		"baseHeightW",
		"title",
		"appBarPadding",
		"appBarPaddingW",
		"contentPadding",
		"contentPaddingW",
		"isInAnimated",
		"isOutAnimated",
		"backgroundColour",
		"isSpaced",
		"isSpacedW",
		"titleCase",
		"borderRadius"
	];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<AppBar> was created with unknown prop '${key}'`);
	});

	function container3_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			appBarContainerDomContent = $$value;
			$$invalidate(10, appBarContainerDomContent);
		});
	}

	$$self.$$set = $$props => {
		if ("expandedHeightW" in $$props) $$invalidate(0, expandedHeightW = $$props.expandedHeightW);
		if ("computedPaddingW" in $$props) $$subscribe_computedPaddingW($$invalidate(1, computedPaddingW = $$props.computedPaddingW));
		if ("baseHeightW" in $$props) $$subscribe_baseHeightW($$invalidate(2, baseHeightW = $$props.baseHeightW));
		if ("title" in $$props) $$invalidate(3, title = $$props.title);
		if ("appBarPadding" in $$props) $$invalidate(16, appBarPadding = $$props.appBarPadding);
		if ("appBarPaddingW" in $$props) $$subscribe_appBarPaddingW($$invalidate(4, appBarPaddingW = $$props.appBarPaddingW));
		if ("contentPadding" in $$props) $$invalidate(17, contentPadding = $$props.contentPadding);
		if ("contentPaddingW" in $$props) $$subscribe_contentPaddingW($$invalidate(5, contentPaddingW = $$props.contentPaddingW));
		if ("isInAnimated" in $$props) $$invalidate(18, isInAnimated = $$props.isInAnimated);
		if ("isOutAnimated" in $$props) $$invalidate(19, isOutAnimated = $$props.isOutAnimated);
		if ("backgroundColour" in $$props) $$invalidate(6, backgroundColour = $$props.backgroundColour);
		if ("isSpaced" in $$props) $$invalidate(20, isSpaced = $$props.isSpaced);
		if ("isSpacedW" in $$props) $$subscribe_isSpacedW($$invalidate(7, isSpacedW = $$props.isSpacedW));
		if ("titleCase" in $$props) $$invalidate(8, titleCase = $$props.titleCase);
		if ("borderRadius" in $$props) $$invalidate(9, borderRadius = $$props.borderRadius);
		if ("$$scope" in $$props) $$invalidate(21, $$scope = $$props.$$scope);
	};

	$$self.$capture_state = () => ({
		onMount,
		onDestroy,
		writable,
		Logo,
		CSSUtility,
		Spacer,
		dropInRaw: dropIn,
		dropOutRaw: dropOut,
		noop,
		expandedHeightW,
		computedPaddingW,
		baseHeightW,
		title,
		appBarPadding,
		appBarPaddingW,
		contentPadding,
		contentPaddingW,
		isInAnimated,
		isOutAnimated,
		backgroundColour,
		isSpaced,
		isSpacedW,
		titleCase,
		borderRadius,
		dropIn: dropIn$1,
		dropOut: dropOut$1,
		appBarContainerDomContent,
		appBarContainerDomContentComputedStyle,
		onResize,
		$baseHeightW,
		$computedPaddingW,
		$appBarPaddingW,
		$contentPaddingW,
		$isSpacedW
	});

	$$self.$inject_state = $$props => {
		if ("expandedHeightW" in $$props) $$invalidate(0, expandedHeightW = $$props.expandedHeightW);
		if ("computedPaddingW" in $$props) $$subscribe_computedPaddingW($$invalidate(1, computedPaddingW = $$props.computedPaddingW));
		if ("baseHeightW" in $$props) $$subscribe_baseHeightW($$invalidate(2, baseHeightW = $$props.baseHeightW));
		if ("title" in $$props) $$invalidate(3, title = $$props.title);
		if ("appBarPadding" in $$props) $$invalidate(16, appBarPadding = $$props.appBarPadding);
		if ("appBarPaddingW" in $$props) $$subscribe_appBarPaddingW($$invalidate(4, appBarPaddingW = $$props.appBarPaddingW));
		if ("contentPadding" in $$props) $$invalidate(17, contentPadding = $$props.contentPadding);
		if ("contentPaddingW" in $$props) $$subscribe_contentPaddingW($$invalidate(5, contentPaddingW = $$props.contentPaddingW));
		if ("isInAnimated" in $$props) $$invalidate(18, isInAnimated = $$props.isInAnimated);
		if ("isOutAnimated" in $$props) $$invalidate(19, isOutAnimated = $$props.isOutAnimated);
		if ("backgroundColour" in $$props) $$invalidate(6, backgroundColour = $$props.backgroundColour);
		if ("isSpaced" in $$props) $$invalidate(20, isSpaced = $$props.isSpaced);
		if ("isSpacedW" in $$props) $$subscribe_isSpacedW($$invalidate(7, isSpacedW = $$props.isSpacedW));
		if ("titleCase" in $$props) $$invalidate(8, titleCase = $$props.titleCase);
		if ("borderRadius" in $$props) $$invalidate(9, borderRadius = $$props.borderRadius);
		if ("appBarContainerDomContent" in $$props) $$invalidate(10, appBarContainerDomContent = $$props.appBarContainerDomContent);
		if ("appBarContainerDomContentComputedStyle" in $$props) appBarContainerDomContentComputedStyle = $$props.appBarContainerDomContentComputedStyle;
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		expandedHeightW,
		computedPaddingW,
		baseHeightW,
		title,
		appBarPaddingW,
		contentPaddingW,
		backgroundColour,
		isSpacedW,
		titleCase,
		borderRadius,
		appBarContainerDomContent,
		$appBarPaddingW,
		$contentPaddingW,
		$isSpacedW,
		dropIn$1,
		dropOut$1,
		appBarPadding,
		contentPadding,
		isInAnimated,
		isOutAnimated,
		isSpaced,
		$$scope,
		slots,
		container3_binding
	];
}

class AppBar extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
			expandedHeightW: 0,
			computedPaddingW: 1,
			baseHeightW: 2,
			title: 3,
			appBarPadding: 16,
			appBarPaddingW: 4,
			contentPadding: 17,
			contentPaddingW: 5,
			isInAnimated: 18,
			isOutAnimated: 19,
			backgroundColour: 6,
			isSpaced: 20,
			isSpacedW: 7,
			titleCase: 8,
			borderRadius: 9
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "AppBar",
			options,
			id: create_fragment$4.name
		});
	}

	get expandedHeightW() {
		return this.$$.ctx[0];
	}

	set expandedHeightW(expandedHeightW) {
		this.$set({ expandedHeightW });
		flush();
	}

	get computedPaddingW() {
		return this.$$.ctx[1];
	}

	set computedPaddingW(computedPaddingW) {
		this.$set({ computedPaddingW });
		flush();
	}

	get baseHeightW() {
		return this.$$.ctx[2];
	}

	set baseHeightW(baseHeightW) {
		this.$set({ baseHeightW });
		flush();
	}

	get title() {
		return this.$$.ctx[3];
	}

	set title(title) {
		this.$set({ title });
		flush();
	}

	get appBarPadding() {
		return this.$$.ctx[16];
	}

	set appBarPadding(appBarPadding) {
		this.$set({ appBarPadding });
		flush();
	}

	get appBarPaddingW() {
		return this.$$.ctx[4];
	}

	set appBarPaddingW(appBarPaddingW) {
		this.$set({ appBarPaddingW });
		flush();
	}

	get contentPadding() {
		return this.$$.ctx[17];
	}

	set contentPadding(contentPadding) {
		this.$set({ contentPadding });
		flush();
	}

	get contentPaddingW() {
		return this.$$.ctx[5];
	}

	set contentPaddingW(contentPaddingW) {
		this.$set({ contentPaddingW });
		flush();
	}

	get isInAnimated() {
		return this.$$.ctx[18];
	}

	set isInAnimated(isInAnimated) {
		this.$set({ isInAnimated });
		flush();
	}

	get isOutAnimated() {
		return this.$$.ctx[19];
	}

	set isOutAnimated(isOutAnimated) {
		this.$set({ isOutAnimated });
		flush();
	}

	get backgroundColour() {
		return this.$$.ctx[6];
	}

	set backgroundColour(backgroundColour) {
		this.$set({ backgroundColour });
		flush();
	}

	get isSpaced() {
		return this.$$.ctx[20];
	}

	set isSpaced(isSpaced) {
		this.$set({ isSpaced });
		flush();
	}

	get isSpacedW() {
		return this.$$.ctx[7];
	}

	set isSpacedW(isSpacedW) {
		this.$set({ isSpacedW });
		flush();
	}

	get titleCase() {
		return this.$$.ctx[8];
	}

	set titleCase(titleCase) {
		this.$set({ titleCase });
		flush();
	}

	get borderRadius() {
		return this.$$.ctx[9];
	}

	set borderRadius(borderRadius) {
		this.$set({ borderRadius });
		flush();
	}
}

/* src\ui\blocks\appBars\ScrollableAppBar.svelte generated by Svelte v3.38.2 */
const file$3 = "src\\ui\\blocks\\appBars\\ScrollableAppBar.svelte";

// (35:1) <AppBar    contentPadding='{CSSUtility.parse(mininumPadding)} 0'    {expandedHeightW}    {baseHeightW}    {appBarPaddingW}    {computedPaddingW}    {isSpacedW}    {isSpaced}    {...$$restProps}   >
function create_default_slot$2(ctx) {
	let current;
	const default_slot_template = /*#slots*/ ctx[13].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[15], null);

	const block = {
		c: function create() {
			if (default_slot) default_slot.c();
		},
		m: function mount(target, anchor) {
			if (default_slot) {
				default_slot.m(target, anchor);
			}

			current = true;
		},
		p: function update(ctx, dirty) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 32768)) {
					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[15], dirty, null, null);
				}
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (default_slot) default_slot.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot$2.name,
		type: "slot",
		source: "(35:1) <AppBar    contentPadding='{CSSUtility.parse(mininumPadding)} 0'    {expandedHeightW}    {baseHeightW}    {appBarPaddingW}    {computedPaddingW}    {isSpacedW}    {isSpaced}    {...$$restProps}   >",
		ctx
	});

	return block;
}

function create_fragment$3(ctx) {
	let component;
	let appbar;
	let current;

	const appbar_spread_levels = [
		{
			contentPadding: "" + (CSSUtility.parse(/*mininumPadding*/ ctx[5]) + " 0")
		},
		{
			expandedHeightW: /*expandedHeightW*/ ctx[0]
		},
		{ baseHeightW: /*baseHeightW*/ ctx[1] },
		{
			appBarPaddingW: /*appBarPaddingW*/ ctx[7]
		},
		{
			computedPaddingW: /*computedPaddingW*/ ctx[2]
		},
		{ isSpacedW: /*isSpacedW*/ ctx[4] },
		{ isSpaced: /*isSpaced*/ ctx[3] },
		/*$$restProps*/ ctx[9]
	];

	let appbar_props = {
		$$slots: { default: [create_default_slot$2] },
		$$scope: { ctx }
	};

	for (let i = 0; i < appbar_spread_levels.length; i += 1) {
		appbar_props = assign(appbar_props, appbar_spread_levels[i]);
	}

	appbar = new AppBar({ props: appbar_props, $$inline: true });

	const block = {
		c: function create() {
			component = element("component");
			create_component(appbar.$$.fragment);
			add_location(component, file$3, 31, 0, 1043);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, component, anchor);
			mount_component(appbar, component, null);
			/*component_binding*/ ctx[14](component);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			const appbar_changes = (dirty & /*CSSUtility, mininumPadding, expandedHeightW, baseHeightW, appBarPaddingW, computedPaddingW, isSpacedW, isSpaced, $$restProps*/ 703)
			? get_spread_update(appbar_spread_levels, [
					dirty & /*CSSUtility, mininumPadding*/ 32 && {
						contentPadding: "" + (CSSUtility.parse(/*mininumPadding*/ ctx[5]) + " 0")
					},
					dirty & /*expandedHeightW*/ 1 && {
						expandedHeightW: /*expandedHeightW*/ ctx[0]
					},
					dirty & /*baseHeightW*/ 2 && { baseHeightW: /*baseHeightW*/ ctx[1] },
					dirty & /*appBarPaddingW*/ 128 && {
						appBarPaddingW: /*appBarPaddingW*/ ctx[7]
					},
					dirty & /*computedPaddingW*/ 4 && {
						computedPaddingW: /*computedPaddingW*/ ctx[2]
					},
					dirty & /*isSpacedW*/ 16 && { isSpacedW: /*isSpacedW*/ ctx[4] },
					dirty & /*isSpaced*/ 8 && { isSpaced: /*isSpaced*/ ctx[3] },
					dirty & /*$$restProps*/ 512 && get_spread_object(/*$$restProps*/ ctx[9])
				])
			: {};

			if (dirty & /*$$scope*/ 32768) {
				appbar_changes.$$scope = { dirty, ctx };
			}

			appbar.$set(appbar_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(appbar.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(appbar.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(component);
			destroy_component(appbar);
			/*component_binding*/ ctx[14](null);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$3.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$3($$self, $$props, $$invalidate) {
	const omit_props_names = [
		"expandedHeightW","scrolledHeightW","baseHeightW","computedPaddingW","isSpaced","isSpacedW","mininumPadding"
	];

	let $$restProps = compute_rest_props($$props, omit_props_names);

	let $computedPaddingW,
		$$unsubscribe_computedPaddingW = noop$1,
		$$subscribe_computedPaddingW = () => ($$unsubscribe_computedPaddingW(), $$unsubscribe_computedPaddingW = subscribe(computedPaddingW, $$value => $$invalidate(16, $computedPaddingW = $$value)), computedPaddingW);

	let $expandedHeightW,
		$$unsubscribe_expandedHeightW = noop$1,
		$$subscribe_expandedHeightW = () => ($$unsubscribe_expandedHeightW(), $$unsubscribe_expandedHeightW = subscribe(expandedHeightW, $$value => $$invalidate(11, $expandedHeightW = $$value)), expandedHeightW);

	let $scrollYW;
	$$self.$$.on_destroy.push(() => $$unsubscribe_computedPaddingW());
	$$self.$$.on_destroy.push(() => $$unsubscribe_expandedHeightW());
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("ScrollableAppBar", slots, ['default']);
	let { expandedHeightW = writable(0) } = $$props;
	validate_store(expandedHeightW, "expandedHeightW");
	$$subscribe_expandedHeightW();
	let { scrolledHeightW = writable(0) } = $$props;
	let { baseHeightW = writable(0) } = $$props;
	let { computedPaddingW = writable(0) } = $$props;
	validate_store(computedPaddingW, "computedPaddingW");
	$$subscribe_computedPaddingW();
	let { isSpaced = true } = $$props;
	let { isSpacedW = writable(isSpaced) } = $$props;
	let { mininumPadding = 8 } = $$props;
	let componentDomContent;
	const appBarPaddingW = writable("");
	const scrollYW = writable(0);
	validate_store(scrollYW, "scrollYW");
	component_subscribe($$self, scrollYW, value => $$invalidate(12, $scrollYW = value));

	window.addEventListener(
		"scroll",
		() => {
			scrollYW.set((() => {
				if ($computedPaddingW === null) {
					return window.scrollY;
				}

				if ($computedPaddingW * 2 - window.scrollY < 0) {
					return $computedPaddingW * 2;
				}

				return window.scrollY;
			})());
		},
		{ passive: true }
	);

	function component_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			componentDomContent = $$value;
			$$invalidate(6, componentDomContent);
		});
	}

	$$self.$$set = $$new_props => {
		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
		$$invalidate(9, $$restProps = compute_rest_props($$props, omit_props_names));
		if ("expandedHeightW" in $$new_props) $$subscribe_expandedHeightW($$invalidate(0, expandedHeightW = $$new_props.expandedHeightW));
		if ("scrolledHeightW" in $$new_props) $$invalidate(10, scrolledHeightW = $$new_props.scrolledHeightW);
		if ("baseHeightW" in $$new_props) $$invalidate(1, baseHeightW = $$new_props.baseHeightW);
		if ("computedPaddingW" in $$new_props) $$subscribe_computedPaddingW($$invalidate(2, computedPaddingW = $$new_props.computedPaddingW));
		if ("isSpaced" in $$new_props) $$invalidate(3, isSpaced = $$new_props.isSpaced);
		if ("isSpacedW" in $$new_props) $$invalidate(4, isSpacedW = $$new_props.isSpacedW);
		if ("mininumPadding" in $$new_props) $$invalidate(5, mininumPadding = $$new_props.mininumPadding);
		if ("$$scope" in $$new_props) $$invalidate(15, $$scope = $$new_props.$$scope);
	};

	$$self.$capture_state = () => ({
		writable,
		AppBar,
		CSSUtility,
		expandedHeightW,
		scrolledHeightW,
		baseHeightW,
		computedPaddingW,
		isSpaced,
		isSpacedW,
		mininumPadding,
		componentDomContent,
		appBarPaddingW,
		scrollYW,
		$computedPaddingW,
		$expandedHeightW,
		$scrollYW
	});

	$$self.$inject_state = $$new_props => {
		if ("expandedHeightW" in $$props) $$subscribe_expandedHeightW($$invalidate(0, expandedHeightW = $$new_props.expandedHeightW));
		if ("scrolledHeightW" in $$props) $$invalidate(10, scrolledHeightW = $$new_props.scrolledHeightW);
		if ("baseHeightW" in $$props) $$invalidate(1, baseHeightW = $$new_props.baseHeightW);
		if ("computedPaddingW" in $$props) $$subscribe_computedPaddingW($$invalidate(2, computedPaddingW = $$new_props.computedPaddingW));
		if ("isSpaced" in $$props) $$invalidate(3, isSpaced = $$new_props.isSpaced);
		if ("isSpacedW" in $$props) $$invalidate(4, isSpacedW = $$new_props.isSpacedW);
		if ("mininumPadding" in $$props) $$invalidate(5, mininumPadding = $$new_props.mininumPadding);
		if ("componentDomContent" in $$props) $$invalidate(6, componentDomContent = $$new_props.componentDomContent);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*scrolledHeightW, $expandedHeightW, $scrollYW*/ 7168) {
			$: scrolledHeightW.set($expandedHeightW - $scrollYW);
		}

		if ($$self.$$.dirty & /*$scrollYW*/ 4096) {
			$: appBarPaddingW.set(`calc(var(--padding) - (${$scrollYW}px / 2)) var(--padding)`);
		}
	};

	return [
		expandedHeightW,
		baseHeightW,
		computedPaddingW,
		isSpaced,
		isSpacedW,
		mininumPadding,
		componentDomContent,
		appBarPaddingW,
		scrollYW,
		$$restProps,
		scrolledHeightW,
		$expandedHeightW,
		$scrollYW,
		slots,
		component_binding,
		$$scope
	];
}

class ScrollableAppBar extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
			expandedHeightW: 0,
			scrolledHeightW: 10,
			baseHeightW: 1,
			computedPaddingW: 2,
			isSpaced: 3,
			isSpacedW: 4,
			mininumPadding: 5
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "ScrollableAppBar",
			options,
			id: create_fragment$3.name
		});
	}

	get expandedHeightW() {
		return this.$$.ctx[0];
	}

	set expandedHeightW(expandedHeightW) {
		this.$set({ expandedHeightW });
		flush();
	}

	get scrolledHeightW() {
		return this.$$.ctx[10];
	}

	set scrolledHeightW(scrolledHeightW) {
		this.$set({ scrolledHeightW });
		flush();
	}

	get baseHeightW() {
		return this.$$.ctx[1];
	}

	set baseHeightW(baseHeightW) {
		this.$set({ baseHeightW });
		flush();
	}

	get computedPaddingW() {
		return this.$$.ctx[2];
	}

	set computedPaddingW(computedPaddingW) {
		this.$set({ computedPaddingW });
		flush();
	}

	get isSpaced() {
		return this.$$.ctx[3];
	}

	set isSpaced(isSpaced) {
		this.$set({ isSpaced });
		flush();
	}

	get isSpacedW() {
		return this.$$.ctx[4];
	}

	set isSpacedW(isSpacedW) {
		this.$set({ isSpacedW });
		flush();
	}

	get mininumPadding() {
		return this.$$.ctx[5];
	}

	set mininumPadding(mininumPadding) {
		this.$set({ mininumPadding });
		flush();
	}
}

var undefined$4 = undefined;

/* src\ui\blocks\appBars\HamburgerAppBar.svelte generated by Svelte v3.38.2 */
const file$2 = "src\\ui\\blocks\\appBars\\HamburgerAppBar.svelte";

// (22:3) {#if $toppingsW != null && typeof $toppingsW === 'object'}
function create_if_block(ctx) {
	let hamburger2;
	let current;

	hamburger2 = new Hamburger2({
			props: {
				toppings: /*$toppingsW*/ ctx[5],
				buttonSize: "calc(2rem + 32px)"
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(hamburger2.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(hamburger2, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const hamburger2_changes = {};
			if (dirty & /*$toppingsW*/ 32) hamburger2_changes.toppings = /*$toppingsW*/ ctx[5];
			hamburger2.$set(hamburger2_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(hamburger2.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(hamburger2.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(hamburger2, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block.name,
		type: "if",
		source: "(22:3) {#if $toppingsW != null && typeof $toppingsW === 'object'}",
		ctx
	});

	return block;
}

// (21:2) {#key $toppingsW}
function create_key_block(ctx) {
	let if_block_anchor;
	let current;
	let if_block = /*$toppingsW*/ ctx[5] != null && typeof /*$toppingsW*/ ctx[5] === "object" && create_if_block(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			if (/*$toppingsW*/ ctx[5] != null && typeof /*$toppingsW*/ ctx[5] === "object") {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*$toppingsW*/ 32) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_key_block.name,
		type: "key",
		source: "(21:2) {#key $toppingsW}",
		ctx
	});

	return block;
}

// (13:0) <ScrollableAppBar   bind:expandedHeightW   bind:baseHeightW   bind:isSpacedW   bind:isSpaced   {...$$restProps}  >
function create_default_slot$1(ctx) {
	let container;
	let previous_key = /*$toppingsW*/ ctx[5];
	let current;
	let key_block = create_key_block(ctx);

	const block = {
		c: function create() {
			container = element("container");
			key_block.c();
			attr_dev(container, "class", "svelte-1glthhx");
			add_location(container, file$2, 19, 1, 535);
		},
		m: function mount(target, anchor) {
			insert_dev(target, container, anchor);
			key_block.m(container, null);
			current = true;
		},
		p: function update(ctx, dirty) {
			if (dirty & /*$toppingsW*/ 32 && safe_not_equal(previous_key, previous_key = /*$toppingsW*/ ctx[5])) {
				group_outros();
				transition_out(key_block, 1, 1, noop$1);
				check_outros();
				key_block = create_key_block(ctx);
				key_block.c();
				transition_in(key_block);
				key_block.m(container, null);
			} else {
				key_block.p(ctx, dirty);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(key_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(key_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(container);
			key_block.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot$1.name,
		type: "slot",
		source: "(13:0) <ScrollableAppBar   bind:expandedHeightW   bind:baseHeightW   bind:isSpacedW   bind:isSpaced   {...$$restProps}  >",
		ctx
	});

	return block;
}

function create_fragment$2(ctx) {
	let scrollableappbar;
	let updating_expandedHeightW;
	let updating_baseHeightW;
	let updating_isSpacedW;
	let updating_isSpaced;
	let current;
	const scrollableappbar_spread_levels = [/*$$restProps*/ ctx[6]];

	function scrollableappbar_expandedHeightW_binding(value) {
		/*scrollableappbar_expandedHeightW_binding*/ ctx[8](value);
	}

	function scrollableappbar_baseHeightW_binding(value) {
		/*scrollableappbar_baseHeightW_binding*/ ctx[9](value);
	}

	function scrollableappbar_isSpacedW_binding(value) {
		/*scrollableappbar_isSpacedW_binding*/ ctx[10](value);
	}

	function scrollableappbar_isSpaced_binding(value) {
		/*scrollableappbar_isSpaced_binding*/ ctx[11](value);
	}

	let scrollableappbar_props = {
		$$slots: { default: [create_default_slot$1] },
		$$scope: { ctx }
	};

	for (let i = 0; i < scrollableappbar_spread_levels.length; i += 1) {
		scrollableappbar_props = assign(scrollableappbar_props, scrollableappbar_spread_levels[i]);
	}

	if (/*expandedHeightW*/ ctx[0] !== void 0) {
		scrollableappbar_props.expandedHeightW = /*expandedHeightW*/ ctx[0];
	}

	if (/*baseHeightW*/ ctx[1] !== void 0) {
		scrollableappbar_props.baseHeightW = /*baseHeightW*/ ctx[1];
	}

	if (/*isSpacedW*/ ctx[3] !== void 0) {
		scrollableappbar_props.isSpacedW = /*isSpacedW*/ ctx[3];
	}

	if (/*isSpaced*/ ctx[2] !== void 0) {
		scrollableappbar_props.isSpaced = /*isSpaced*/ ctx[2];
	}

	scrollableappbar = new ScrollableAppBar({
			props: scrollableappbar_props,
			$$inline: true
		});

	binding_callbacks.push(() => bind(scrollableappbar, "expandedHeightW", scrollableappbar_expandedHeightW_binding));
	binding_callbacks.push(() => bind(scrollableappbar, "baseHeightW", scrollableappbar_baseHeightW_binding));
	binding_callbacks.push(() => bind(scrollableappbar, "isSpacedW", scrollableappbar_isSpacedW_binding));
	binding_callbacks.push(() => bind(scrollableappbar, "isSpaced", scrollableappbar_isSpaced_binding));

	const block = {
		c: function create() {
			create_component(scrollableappbar.$$.fragment);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			mount_component(scrollableappbar, target, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			const scrollableappbar_changes = (dirty & /*$$restProps*/ 64)
			? get_spread_update(scrollableappbar_spread_levels, [get_spread_object(/*$$restProps*/ ctx[6])])
			: {};

			if (dirty & /*$$scope, $toppingsW*/ 4128) {
				scrollableappbar_changes.$$scope = { dirty, ctx };
			}

			if (!updating_expandedHeightW && dirty & /*expandedHeightW*/ 1) {
				updating_expandedHeightW = true;
				scrollableappbar_changes.expandedHeightW = /*expandedHeightW*/ ctx[0];
				add_flush_callback(() => updating_expandedHeightW = false);
			}

			if (!updating_baseHeightW && dirty & /*baseHeightW*/ 2) {
				updating_baseHeightW = true;
				scrollableappbar_changes.baseHeightW = /*baseHeightW*/ ctx[1];
				add_flush_callback(() => updating_baseHeightW = false);
			}

			if (!updating_isSpacedW && dirty & /*isSpacedW*/ 8) {
				updating_isSpacedW = true;
				scrollableappbar_changes.isSpacedW = /*isSpacedW*/ ctx[3];
				add_flush_callback(() => updating_isSpacedW = false);
			}

			if (!updating_isSpaced && dirty & /*isSpaced*/ 4) {
				updating_isSpaced = true;
				scrollableappbar_changes.isSpaced = /*isSpaced*/ ctx[2];
				add_flush_callback(() => updating_isSpaced = false);
			}

			scrollableappbar.$set(scrollableappbar_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(scrollableappbar.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(scrollableappbar.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(scrollableappbar, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$2.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$2($$self, $$props, $$invalidate) {
	const omit_props_names = ["expandedHeightW","baseHeightW","isSpaced","isSpacedW","toppings","toppingsW"];
	let $$restProps = compute_rest_props($$props, omit_props_names);

	let $toppingsW,
		$$unsubscribe_toppingsW = noop$1,
		$$subscribe_toppingsW = () => ($$unsubscribe_toppingsW(), $$unsubscribe_toppingsW = subscribe(toppingsW, $$value => $$invalidate(5, $toppingsW = $$value)), toppingsW);

	$$self.$$.on_destroy.push(() => $$unsubscribe_toppingsW());
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("HamburgerAppBar", slots, []);
	let { expandedHeightW = writable(0) } = $$props;
	let { baseHeightW = writable(0) } = $$props;
	let { isSpaced = true } = $$props;
	let { isSpacedW = writable(isSpaced) } = $$props;
	let { toppings = {} } = $$props;
	let { toppingsW = writable(toppings) } = $$props;
	validate_store(toppingsW, "toppingsW");
	$$subscribe_toppingsW();

	function scrollableappbar_expandedHeightW_binding(value) {
		expandedHeightW = value;
		$$invalidate(0, expandedHeightW);
	}

	function scrollableappbar_baseHeightW_binding(value) {
		baseHeightW = value;
		$$invalidate(1, baseHeightW);
	}

	function scrollableappbar_isSpacedW_binding(value) {
		isSpacedW = value;
		$$invalidate(3, isSpacedW);
	}

	function scrollableappbar_isSpaced_binding(value) {
		isSpaced = value;
		$$invalidate(2, isSpaced);
	}

	$$self.$$set = $$new_props => {
		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
		$$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
		if ("expandedHeightW" in $$new_props) $$invalidate(0, expandedHeightW = $$new_props.expandedHeightW);
		if ("baseHeightW" in $$new_props) $$invalidate(1, baseHeightW = $$new_props.baseHeightW);
		if ("isSpaced" in $$new_props) $$invalidate(2, isSpaced = $$new_props.isSpaced);
		if ("isSpacedW" in $$new_props) $$invalidate(3, isSpacedW = $$new_props.isSpacedW);
		if ("toppings" in $$new_props) $$invalidate(7, toppings = $$new_props.toppings);
		if ("toppingsW" in $$new_props) $$subscribe_toppingsW($$invalidate(4, toppingsW = $$new_props.toppingsW));
	};

	$$self.$capture_state = () => ({
		writable,
		Hamburger2,
		ScrollableAppBar,
		expandedHeightW,
		baseHeightW,
		isSpaced,
		isSpacedW,
		toppings,
		toppingsW,
		$toppingsW
	});

	$$self.$inject_state = $$new_props => {
		if ("expandedHeightW" in $$props) $$invalidate(0, expandedHeightW = $$new_props.expandedHeightW);
		if ("baseHeightW" in $$props) $$invalidate(1, baseHeightW = $$new_props.baseHeightW);
		if ("isSpaced" in $$props) $$invalidate(2, isSpaced = $$new_props.isSpaced);
		if ("isSpacedW" in $$props) $$invalidate(3, isSpacedW = $$new_props.isSpacedW);
		if ("toppings" in $$props) $$invalidate(7, toppings = $$new_props.toppings);
		if ("toppingsW" in $$props) $$subscribe_toppingsW($$invalidate(4, toppingsW = $$new_props.toppingsW));
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		expandedHeightW,
		baseHeightW,
		isSpaced,
		isSpacedW,
		toppingsW,
		$toppingsW,
		$$restProps,
		toppings,
		scrollableappbar_expandedHeightW_binding,
		scrollableappbar_baseHeightW_binding,
		scrollableappbar_isSpacedW_binding,
		scrollableappbar_isSpaced_binding
	];
}

class HamburgerAppBar extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
			expandedHeightW: 0,
			baseHeightW: 1,
			isSpaced: 2,
			isSpacedW: 3,
			toppings: 7,
			toppingsW: 4
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "HamburgerAppBar",
			options,
			id: create_fragment$2.name
		});
	}

	get expandedHeightW() {
		return this.$$.ctx[0];
	}

	set expandedHeightW(expandedHeightW) {
		this.$set({ expandedHeightW });
		flush();
	}

	get baseHeightW() {
		return this.$$.ctx[1];
	}

	set baseHeightW(baseHeightW) {
		this.$set({ baseHeightW });
		flush();
	}

	get isSpaced() {
		return this.$$.ctx[2];
	}

	set isSpaced(isSpaced) {
		this.$set({ isSpaced });
		flush();
	}

	get isSpacedW() {
		return this.$$.ctx[3];
	}

	set isSpacedW(isSpacedW) {
		this.$set({ isSpacedW });
		flush();
	}

	get toppings() {
		return this.$$.ctx[7];
	}

	set toppings(toppings) {
		this.$set({ toppings });
		flush();
	}

	get toppingsW() {
		return this.$$.ctx[4];
	}

	set toppingsW(toppingsW) {
		this.$set({ toppingsW });
		flush();
	}
}

var undefined$3 = undefined;

/* src\ui\routes\errors\NotFoundRoute.svelte generated by Svelte v3.38.2 */
const file$1 = "src\\ui\\routes\\errors\\NotFoundRoute.svelte";

// (4:0) <Scene   isInAnimated={true}   isOutAnimated={true}   height='100%'   align='flex-end'  >
function create_default_slot(ctx) {
	let container;
	let heading;

	const block = {
		c: function create() {
			container = element("container");
			heading = element("heading");
			heading.textContent = "404.";
			attr_dev(heading, "class", "svelte-11we9ge");
			add_location(heading, file$1, 12, 2, 211);
			attr_dev(container, "class", "content");
			add_location(container, file$1, 9, 1, 174);
		},
		m: function mount(target, anchor) {
			insert_dev(target, container, anchor);
			append_dev(container, heading);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(container);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot.name,
		type: "slot",
		source: "(4:0) <Scene   isInAnimated={true}   isOutAnimated={true}   height='100%'   align='flex-end'  >",
		ctx
	});

	return block;
}

function create_fragment$1(ctx) {
	let scene;
	let current;

	scene = new Fragment({
			props: {
				isInAnimated: true,
				isOutAnimated: true,
				height: "100%",
				align: "flex-end",
				$$slots: { default: [create_default_slot] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(scene.$$.fragment);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			mount_component(scene, target, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			const scene_changes = {};

			if (dirty & /*$$scope*/ 1) {
				scene_changes.$$scope = { dirty, ctx };
			}

			scene.$set(scene_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(scene.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(scene.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(scene, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$1.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$1($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("NotFoundRoute", slots, []);
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<NotFoundRoute> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({ Scene: Fragment });
	return [];
}

class NotFoundRoute extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "NotFoundRoute",
			options,
			id: create_fragment$1.name
		});
	}
}

var undefined$2 = undefined;

/* src\App.svelte generated by Svelte v3.38.2 */
const file = "src\\App.svelte";

function create_fragment(ctx) {
	let main;
	let hamburgerappbar;
	let t0;
	let router;
	let t1;
	let toast;
	let current;

	let hamburgerappbar_props = {
		isSpaced: false,
		isInAnimated: true,
		isOutAnimated: true,
		toppingsW: /*Ctx*/ ctx[0].s.globalHamburger
	};

	hamburgerappbar = new HamburgerAppBar({
			props: hamburgerappbar_props,
			$$inline: true
		});

	/*hamburgerappbar_binding*/ ctx[3](hamburgerappbar);

	router = new Router({
			props: { routes: /*RouteDestinations*/ ctx[2] },
			$$inline: true
		});

	router.$on("routeLoading", /*routeLoading_handler*/ ctx[4]);
	router.$on("routeLoaded", /*routeLoaded_handler*/ ctx[5]);

	toast = new Toast({
			props: { toastsW: /*Ctx*/ ctx[0].s.globalToasts },
			$$inline: true
		});

	const block = {
		c: function create() {
			main = element("main");
			create_component(hamburgerappbar.$$.fragment);
			t0 = space();
			create_component(router.$$.fragment);
			t1 = space();
			create_component(toast.$$.fragment);
			attr_dev(main, "class", "svelte-6h06oz");
			add_location(main, file, 40, 0, 1245);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, main, anchor);
			mount_component(hamburgerappbar, main, null);
			append_dev(main, t0);
			mount_component(router, main, null);
			append_dev(main, t1);
			mount_component(toast, main, null);
			/*main_binding*/ ctx[6](main);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			const hamburgerappbar_changes = {};
			if (dirty & /*Ctx*/ 1) hamburgerappbar_changes.toppingsW = /*Ctx*/ ctx[0].s.globalHamburger;
			hamburgerappbar.$set(hamburgerappbar_changes);
			const toast_changes = {};
			if (dirty & /*Ctx*/ 1) toast_changes.toastsW = /*Ctx*/ ctx[0].s.globalToasts;
			toast.$set(toast_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(hamburgerappbar.$$.fragment, local);
			transition_in(router.$$.fragment, local);
			transition_in(toast.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(hamburgerappbar.$$.fragment, local);
			transition_out(router.$$.fragment, local);
			transition_out(toast.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(main);
			/*hamburgerappbar_binding*/ ctx[3](null);
			destroy_component(hamburgerappbar);
			destroy_component(router);
			destroy_component(toast);
			/*main_binding*/ ctx[6](null);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("App", slots, []);
	let mainDomContent;
	const Paths = ["/", "/incompatible", "/call", "/*"];

	const RouteDestinations = {
		[Paths[0]]: LandingRoute,
		[Paths[1]]: wrap$1({
			asyncComponent: () => import('./IncompatibleRoute-3b77b3ba.js')
		}),
		[Paths[2]]: wrap$1({
			asyncComponent: () => import('./CallRoute-1e0a97a9.js')
		}),
		[Paths[Paths.length - 1]]: NotFoundRoute
	};

	try {
		Compatibler.throw(Compatibler.test());
	} catch(err) {
		Ctx.incompatibleReason = err.message;
		push("/incompatible");
	}

	onMount(() => {
		ScrollUtility.target = mainDomContent;
	});

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
	});

	function hamburgerappbar_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			Ctx.globalAppBar = $$value;
			$$invalidate(0, Ctx);
		});
	}

	const routeLoading_handler = () => {
		$$invalidate(0, Ctx.isRouting = true, Ctx);
	};

	const routeLoaded_handler = () => {
		$$invalidate(0, Ctx.isRouting = false, Ctx);
	};

	function main_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			mainDomContent = $$value;
			$$invalidate(1, mainDomContent);
		});
	}

	$$self.$capture_state = () => ({
		onMount,
		Router,
		push,
		wrap: wrap$1,
		Compatibler,
		ScrollUtility,
		LandingScene: LandingRoute,
		Ctx,
		HamburgerAppBar,
		Toast,
		NotFoundScene: NotFoundRoute,
		mainDomContent,
		Paths,
		RouteDestinations
	});

	$$self.$inject_state = $$props => {
		if ("mainDomContent" in $$props) $$invalidate(1, mainDomContent = $$props.mainDomContent);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		Ctx,
		mainDomContent,
		RouteDestinations,
		hamburgerappbar_binding,
		routeLoading_handler,
		routeLoaded_handler,
		main_binding
	];
}

class App extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance, create_fragment, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "App",
			options,
			id: create_fragment.name
		});
	}
}

var undefined$1 = undefined;

const app = new App({
    target: document.body,
    props: {},
});

export { Gradient2 as $, create_slot as A, update_slot as B, Ctx as C, binding_callbacks as D, bind as E, Fragment as F, set_style as G, CSSUtility as H, add_flush_callback as I, compute_rest_props as J, subscribe as K, AppBar as L, writable as M, validate_store as N, exclude_internal_props as O, flush as P, Button as Q, is_function as R, Spacer as S, toggle_class as T, listen_dev as U, run_all as V, createEventDispatcher as W, WindowUtility as X, component_subscribe as Y, set_store_value as Z, globals as _, attr_dev as a, onMount as a0, push as a1, Input as a2, Dialog as a3, ToastItem as a4, Levels as a5, app as a6, add_location as b, create_component as c, append_dev as d, element as e, transition_in as f, transition_out as g, detach_dev as h, insert_dev as i, destroy_component as j, dispatch_dev as k, SvelteComponentDev as l, mount_component as m, noop$1 as n, init as o, safe_not_equal as p, assign as q, replace as r, space as s, text as t, empty as u, validate_slots as v, get_spread_update as w, get_spread_object as x, group_outros as y, check_outros as z };
//# sourceMappingURL=index-9b9bc12d.js.map
