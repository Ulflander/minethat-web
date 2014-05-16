


# Run gulp and start server in a local environment
default: lint start-server

lint:
	@fixjsstyle --nostrict \
		--jslint_error blank_lines_at_top_level \
		--jslint_error braces_around_type \
		--jslint_error optional_type_marker \
		--jslint_error unused_private_members \
		-e src/client/vendors \
		--jsdoc -r src
	@gjslint --nostrict \
		--jslint_error blank_lines_at_top_level \
		--jslint_error braces_around_type \
		--jslint_error optional_type_marker \
		--jslint_error unused_private_members \
		-e src/client/vendors \
		--jsdoc -r src
	@gulp

# Show makefile usage
help:
	@echo "\nWELCOME IN MINETHAT PROJECT\n"
	@awk 'BEGIN{print "Makefile usage:\n"};/^[^#[:space:]\.].*:/&&$$0!~/=/{split($$0,t,":");printf("%8s %-16s %s\n","make",t[1],x);x=""};/^#/{gsub(/^# /,"");x=$$0;if(x!="")x="- "x};END{printf "\n"}' Makefile

start-server:
	@export ENV=local && node src/server/index.js

.PHONY: \
	default \