describe("dome", function () {
    describe("get", function () {
        it("can get elements by id", function () {
            var el = document.getElementById('one');
            expect(dome.get("#one")[0]).toEqual(el);
        });
        it("can get elements by class", function () {
            expect(dome.get(".two").length).toEqual(3);
        });

        it("can get elements by tag name", function () {
            expect(dome.get("b").length).toEqual(4);
        })
        it("creates a dome object from a single node", function () {
            var one = document.getElementById('one');
            expect(dome.get(one)[0]).toBe(one);
        });
        it("creates a dome object from a NodeList", function () {
            var two = $(".two").get();
            expect(dome.get(two)[0]).toBe(two[0]);
        });
    });

    describe("utils", function () {
        it("can loop over each element", function () {
            var o =  {
                loop: function (el) { }
            };
            spyOn(o, 'loop');
            dome.get("b").forEach(o.loop);

            expect(o.loop).toHaveBeenCalled();
        });

        it("can map over each element", function () {
            var a = dome.get("b").map(function (el) {
                return el.className;
            });
            expect(a.join('')).toEqual('twotwotwo');
        });
    });
    describe("text", function () {
        beforeEach(function () {
            this.d = dome.get("#one");
        });
        it("can set the text of an element", function () {
            this.d.text("one");
            expect(this.d[0].innerText).toEqual("one");
        });
        it("can get the text of an element", function () {
            this.d.text("one");
            expect(this.d.text()).toEqual("one");
        });
        afterEach(function () {
            this.d.text("");
        });
    });
    describe("html", function () {
        beforeEach(function () {
            this.d = dome.get(".two");
        });
        afterEach(function () {
            this.d.html("");
        });
        it("can set the html content of an element", function () {
            this.d.html("<strong>Test!</strong>");
            expect(this.d[0].innerHTML.toLowerCase()).toEqual("<strong>test!</strong>");
        });
        it("can get the html content of an element", function () {
            this.d.html("<strong>Test!</strong>");
            expect(this.d.html()[0].toLowerCase()).toEqual("<strong>test!</strong>");
        });
    });
    describe("addClass", function () {
        beforeEach(function () {
            this.d = dome.get(".two");
        });
        afterEach(function () {
            this.d.forEach(function (el) {
                el.className = "two";
            });
        });
        it("can add a single class to elements", function () {
            this.d.addClass('single');
            expect(this.d[0].className.indexOf('single')).toBeGreaterThan(-1);
        });
        it("can add multiple classes (via array) to elements", function () {
            this.d.addClass(["multiple", "classes"]);
            var cn = this.d[0].className;
            expect(cn.indexOf("multiple")).toBeLessThan(cn.indexOf("classes"));
        });
    });
    describe("removeClass", function () {
        beforeEach(function () {
            this.d = dome.get(".two");
            this.d.addClass("classes");
        });
        afterEach(function () {
            this.d.forEach(function (el) {
                el.className = "two";
            });
        });
        it("can remove a class from elements", function () {
            this.d.removeClass("classes");
            expect(this.d[0].className.indexOf('classes')).toBe(-1);
        });
        it("removes all instances of that class from elements", function () {
            this.d.addClass("test classes");
            this.d.removeClass("classes");
            expect(this.d[0].className.indexOf('classes')).toBe(-1);
        });
    });
    describe("attr", function () {
        beforeEach(function () {
            this.d = dome.get(".two");
        });
        afterEach(function () {
            this.d.forEach(function (el) {
                el.removeAttribute('data-something');
            });
        });
        it("can set element attributes", function () {
            this.d.attr("data-something", "some-value");
            expect(this.d[0].getAttribute("data-something")).toEqual("some-value");
        });
        it("can get element attributes", function () {
            this.d.attr("data-something", "some-value");
            expect(this.d.attr("data-something")[0]).toEqual("some-value");
        });
    });

    describe("create", function () {
        it("can create elements", function () {
            expect(dome.create("p")[0].tagName).toEqual("P");
        });
        it("can create elements with attributes", function () {
            var d = dome.create("p", { id: "some-id", className: "some-class", text: "some-text", "data-attr": "some-data"});
            expect(d[0].id).toBe("some-id");
            expect(d[0].className.indexOf("some-class")).toBeGreaterThan(-1);
            expect(d.text()).toBe("some-text");
            expect(d.attr("data-attr")).toBe("some-data");
        });
    });
    describe("append", function () {
        beforeEach(function () {
            this.p = dome.create("p", { className: "one-child", text: "text" });
            this.q = dome.create("p", { className: "one-child", text: "text" });
        });
        afterEach(function () {
            dome.get(".one-child").forEach(function (el) {
                el.parentNode.removeChild(el);
            });
        });
        it("can append new elements to an existing element", function () {
            dome.get("#one").append(this.p);
            expect(dome.get(".one-child")[0].parentNode.id).toEqual("one");
        });
        it("can append new elements to multiple existing elements", function () {
            dome.get(".two").append(dome.create("p", { className: "one-child", text: "text" }));
            var d = dome.get(".one-child");
            expect(d[0].parentNode.className.indexOf("two")).toBeGreaterThan(-1);
            expect(d[1].parentNode.className.indexOf("two")).toBeGreaterThan(-1);
            expect(d[2].parentNode.className.indexOf("two")).toBeGreaterThan(-1);
        });
        it("can append elements already in the DOM to an existing element", function () {
            dome.get("#elements").append(dome.get("#one"));
            expect(dome.get("#one")[0].parentNode.id).toBe("elements");
        });
        it("can append elements already in the DOM to multiple existing elements", function () {
            dome.get("#elements").append(this.p).append(this.q); 
            
            var d1 = dome.get(".two"),
                d2 = dome.get(".one-child");
            d1.append(d2, true);
            dome.get(".two").forEach(function (el) {
                expect(el.childNodes.length).toBe(2);
            });
        });
    });
    describe("prepend", function () {
        beforeEach(function () {
            this.d = dome.get("#one");
            this.s = dome.create("span", { text: 1 });
            this.t = dome.create("span", { text: 2 });
        });
        afterEach(function () {
            dome.get("span").forEach(function (el) {
                el.parentNode.removeChild(el);
            });
        });
        it("can prepend elements to an existing element", function () {
            this.d.prepend(this.s);
            expect(this.d[0].firstChild.tagName).toBe(this.s[0].tagName);
        });
        it("can prepend new elements to multiple existing elements", function () {
            var d = dome.get(".two");
            d.prepend(this.s);
            expect(d[0].firstChild.tagName).toBe(this.s[0].tagName);
            expect(d[1].firstChild.tagName).toBe(this.s[0].tagName);
        });
        it("can prepend elements already in the dome to existing elements", function () {
            var d = dome.get("#elements");
            d.prepend(this.d);
            expect(d[0].firstChild.tagName).toBe(this.d[0].tagName);
        });
        it("can prepend elements already in the DOM to multiple existing elements", function () {
            this.d.append(this.s).append(this.t);
            var two = dome.get(".two");
            two.prepend(dome.get("span"));

            two.forEach(function (el) {
                expect(el.childNodes.length).toBe(2); 
            });

        });
        
    });

    describe("remove", function () {
        it("removes an element from the DOM", function () {
            var o = dome.get("#one"),
                p = dome.create("p", {text: "p" });
            o.append(p);
            p.remove()
            expect(o[0].children.length).toBe(0);
        });
    });
