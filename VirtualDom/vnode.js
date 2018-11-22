function Element(tagName,props,children = []){
    this.tagName = tagName;
    this.props = props;
    this.children = children;
}

Element.prototype.render = function(){
    const el = document.createElement(this.tagName);
    const props = this.props;

    for (const propName in props) {
        if (props.hasOwnProperty(propName)) {
            const propValue = props[propName];
            el.setAttribute(propName,propValue);
        }
    }

    const children = this.children;
    
    children.forEach((child)=>{
        const childEl = (child instanceof Element)
            ? child.render()    //如果子节点也是VNode,递归构建DOM节点
            : document.createTextNode(child);   //如果是字符串，则构建文本节点
        el.appendChild(childEl);    
    })

    return el;
}

module.exports = function(tagName,props,children){
    return new Element(tagName,props,children);
}