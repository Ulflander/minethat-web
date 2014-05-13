
# Continuous Quality Assurance

When writing software in a lean startup environment, let's face it, you won't always have the time to properly implement all 
the unit and feature tests: your focus should rather be on validating that your product will be used by actual people. How then can you ensure that your software is good enough to ship? Static code analysis and code linting are part of the solution.

Static code analysis will save developers hours of debugging and ensure a coherent codebase in term
of style and implementation. These tools will alert the developer about all those issues:

* Code conventions not followed
* Potential bugs
* Potential security issues
* Duplicated code
* Weak documentation
* Code not covered by tests

In order to be really efficient, code analysis should run both before commiting a change to the codebase (pre-commit hook, ensuring the developer sends quality code to the repository) and again during the build process (ensuring that all different commits from different developers didn't insert flaws in the code).

It takes only a pair of hours before starting a new software project to setup a working environment that will embed these tools and 
run them each time it is necessary — it's worth the time!

As for reference, our current stack at Minethat is mainly based on Java for middleware services, and on Node.js for the front-end. Here are the tools that run against our codebase each time a change is introduced.

#### Java

- [Findbugs](http://findbugs.sourceforge.net/) is pure static analysis
- [PMD](http://pmd.sourceforge.net/) is complementary to Findbugs: it may catch some other flaws in your code, but most important is it embeds a code duplication detector: your code won't build until it's properly factorised.
- [Checkstyle](http://checkstyle.sourceforge.net/) ensures your coding standards 
- [Cobertura]() evaluates the test coverage of your code

#### Node.js

As easy as it is to do static analysis on Java - a static language - it's far more difficult on Javascript, that is a dynamic language. That's why most of the tools out there are oriented on styling and first-level-only static analysis.

- JSHint/JSLint - Two pretty well known linters.
- Google Closure Compiler + Linter - Use the linter to validate code style, and the compiler to check for compile-time issues. Linter can also automatically fix some style imperfections - that's a neat time-saver.
- Plato - A very interesting new one: it provides you metrics about the complexity and the maintainability of your Javascript codebase. We setuped this one so if the average maintainability across our codebase is too low, developers can't build the app until they properly refactored crappy code.

JSHint, JSLint and Google Closure Linter are three redundant tools, you should select one and stick to it. Our opinion is that JSHint is too permissive and does not really enforce good practices.

#### Last thoughts

Using these tools during development are not only important for the global quality of the codebase, it's not only about the developer vanity: it's definitely a game-changer when a startup has to pivot or to shift. A truly factorised codebase have far more capabilities to be tweaked to serve a new purpose.


