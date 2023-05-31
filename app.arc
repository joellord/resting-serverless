@app
resting-serverless

@shared

@http
get /
get /cats
get /cats/:id
post /cats

@aws
# profile default
region us-west-2
architecture arm64
