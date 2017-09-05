package com.sap.pia.producer;

import java.io.IOException;
import java.util.Properties;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.odata4j.jersey.producer.resources.ODataProducerProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Servlet implementation class OdataServlet
 */
public class OdataServlet extends HttpServlet
{
	private static final long serialVersionUID= 1L;
	/**
	 * Static constant Logger object used for adding various logs .
	 */
	private static final Logger LOGGER= LoggerFactory.getLogger(OdataServlet.class);

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{

		int status= HttpServletResponse.SC_OK;

		try
		{

			UsageCloudProducerFactory usageCloudProductFactory= new UsageCloudProducerFactory();
			Properties properties= null;
			ODataProducerProvider.setInstance(usageCloudProductFactory.create(properties));
		}
		catch(NullPointerException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
			status= HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
		}
		response.setStatus(status);

	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{

	}

}
